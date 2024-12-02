import OpenAI from "openai";
import {
    GenerateContentCommandOutput,
    GenerateContentCommandOutputSchema,
} from '@agent-plane/content-generator/metadata/content-agent.schema';
import { withRetry } from "@utils/tools/retry";
import { AIModel } from "@utils/metadata/agent.cost";
import { getTokenCosts } from "@utils/tools/ai-middleware";


// @ts-ignore
import { Resource } from "sst";
import { contentRepository } from "@agent-plane/content-generator/adapters/secondary/datastore.adapter";

const openai = new OpenAI({
  apiKey: Resource.OpenAIApiKey.value
});

export const generateContent = async (prompt: string): Promise<GenerateContentCommandOutput> => {
  console.info("Executing OpenAI API for Content Generation");
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant that generates content. You can use tools to help you generate better content." },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 500,
      tools: [
        {
          type: "function",
          function: {
            name: "save_content",
            description: "Save the generated content to the database",
            parameters: {
              type: "object",
              properties: {
                content: {
                  type: "string",
                  description: "The content to save"
                }
              },
              required: ["content"]
            }
          }
        }
      ],
      tool_choice: "auto"
    });

    const cost = await getTokenCosts(AIModel.GPT4, response.usage?.prompt_tokens || 0, response.usage?.completion_tokens || 0);
    console.info(`Cost: $${cost.toFixed(2)}`);

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI API");
    }

    // Handle any tool calls
    if (response.choices[0].message.tool_calls) {
      for (const toolCall of response.choices[0].message.tool_calls) {
        if (toolCall.function.name === "save_content") {
          try {
            const args = JSON.parse(toolCall.function.arguments);
            await contentRepository.saveContent(args.content);
          } catch (error) {
            console.error('Error processing tool call:', error);
            throw new Error('Failed to process tool call');
          }
        }
      }
    }

    return { content: content };

  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
};

export const getContent = withRetry(generateContent, { retries: 3, delay: 1000, onRetry: (error: Error) => console.warn('Retrying generateContent due to error:', error) });
