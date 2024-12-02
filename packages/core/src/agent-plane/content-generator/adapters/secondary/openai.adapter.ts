import OpenAI from "openai";
import {
  Avatar,
  AvatarGenerationCommandInput,
  GenerateFeedbackCommandOutput,
  GenerateFeedbackCommandOutputSchema,
  FeedbackPrepOutput,
  FeedbackPrepCommandInput,
  VariationOutput,
  AvatarSchema
} from '@agent-plane/feedback-generator/metadata/feedback-agent.schema';
import { withRetry } from "@utils/tools/retry";

import { AIModel } from "@utils/metadata/agent.cost";
import { getTokenCosts } from "@utils/tools/ai-middleware";
import { generateFeedbackPrompt, generateUniqueAvatarPrompt } from "@agent-plane/feedback-generator/metadata/feeback-agent.prompt";
import { zodToJsonSchema } from "zod-to-json-schema";
import { variationRepository } from "@agent-plane/feedback-generator/adapters/secondary/datastore.adapter";

// @ts-ignore
import { Resource } from "sst";
import { feedbackRepository } from "./datastore.repository";

const openai = new OpenAI({
  apiKey: Resource.OpenAIApiKey.value
});

export const generateAvatar = async (commandInput: AvatarGenerationCommandInput): Promise<Avatar> => {
  console.info("Executing OpenAI API for Avatar Generation");
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates avatar descriptions." },
        { role: "user", content: commandInput.prompt },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_avatar",
            description: "Generate an avatar description based on the given prompt",
            parameters: zodToJsonSchema(AvatarSchema),
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "generate_avatar" } },
      temperature: 0.8,
    });

    const cost = await getTokenCosts(AIModel.GPT4, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0);
    console.info(`Cost: $${cost.toFixed(2)}`);

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall && toolCall.function.name === "generate_avatar") {
      const avatar = JSON.parse(toolCall.function.arguments || '{}');
      return AvatarSchema.parse(avatar);
    } else {
      throw new Error("Unexpected response format from OpenAI API");
    }
  } catch (error) {
    console.error('Error generating avatar:', error);
    throw error;
  }
};

export const getExperimentVariations = async (experimentId: string): Promise<VariationOutput[]> => {
  const variations = await variationRepository.getVariationsByExperimentId(experimentId);
  return variations;
}

export const getVariationBufferById = async (variationId: string): Promise<Buffer | null> => {
  const buffer = await variationRepository.getVariationBufferById(variationId);
  return buffer;
}

export const feedbackPrep = withRetry(
  async (commandInput: FeedbackPrepCommandInput): Promise<FeedbackPrepOutput> => {
    try {
      const avatarPrompt = generateUniqueAvatarPrompt();
      const avatar = await getAvatar({ prompt: avatarPrompt });
      const feedbackStructuredOutput = JSON.stringify(zodToJsonSchema(GenerateFeedbackCommandOutputSchema));
      const variations = await getExperimentVariations(commandInput.experimentId);
      const feedbackPrompt = generateFeedbackPrompt(avatar, variations, feedbackStructuredOutput);
      const variationBuffer = await getVariationBufferById(variations[0].variationId);
      const variationBuffer2 = await getVariationBufferById(variations[1].variationId);

      if (!variationBuffer || !variationBuffer2) {
        throw new Error("Failed to retrieve variation images");
      }

      const output: FeedbackPrepOutput = {
        prompt: feedbackPrompt,
        buffer: variationBuffer,
        buffer2: variationBuffer2
      }

      return output;
    } catch (error) {
      console.error('Error generating feedback prep:', error);
      throw error;
    }
  },
  { retries: 3, delay: 1000, onRetry: (error: Error) => console.warn('Retrying feedbackPrep due to error:', error) }
);

export const generateFeedback = async (commandInput: FeedbackPrepOutput): Promise<GenerateFeedbackCommandOutput> => {
  console.info("Executing OpenAI API for Feedback Generation");
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: commandInput.prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${commandInput.buffer.toString('base64')}`,
              },
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/png;base64,${commandInput.buffer2.toString('base64')}`,
              },
            },
          ],
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "generate_feedback",
            description: "Generate feedback based on the provided images and prompt",
            parameters: zodToJsonSchema(GenerateFeedbackCommandOutputSchema),
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "generate_feedback" } },
      max_tokens: 300,
    });

    const cost = await getTokenCosts(AIModel.GPT4Vision, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0);
    console.info(`Cost: $${cost.toFixed(2)}`);

    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (toolCall && toolCall.function.name === "generate_feedback") {
      const feedback = JSON.parse(toolCall.function.arguments || '{}');
      const parsedFeedback = GenerateFeedbackCommandOutputSchema.parse(feedback);
      console.info('Feedback generated', parsedFeedback);
      return parsedFeedback;
    } else {
      throw new Error("Unexpected response format from OpenAI API");
    }
  } catch (error) {
    console.error('Error generating feedback:', error);
    return {
      selectedVariationId: 'error',
      response: `Error generating feedback: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export const getAvatar = withRetry(generateAvatar, { retries: 3, delay: 1000, onRetry: (error: Error) => console.warn('Retrying generateAvatar due to error:', error) });
export const getFeedback = withRetry(generateFeedback, { retries: 3, delay: 1000, onRetry: (error: Error) => console.warn('Retrying generateFeedback due to error:', error) });

