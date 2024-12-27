import OpenAI from "openai";
import { WebsiteReview, websiteReviewAgentSystemPrompt, WebsiteReviewSchema } from "src/agent-plane/website-reviewer/metadata/website-reviewer.schema";

import { zodToJsonSchema } from "zod-to-json-schema";
import { webTools } from "./web-tools.adapter";



//@ts-ignore
import { Resource } from "sst";
import { withRetry } from "@utils/tools/retry";

const openai = new OpenAI({
  apiKey: Resource.OpenAIApiKey.value
});



export const reviewWebsite = async (url: string): Promise<WebsiteReview> => {
  try {
    // Convert URL to markdown first
    const markdown = await webTools.urlToMarkdown(url);
    const structuredOutput = WebsiteReviewSchema;
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: websiteReviewAgentSystemPrompt(structuredOutput) },
        { role: "user", content: `Please analyze this website content:\n\n${markdown}` }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
      tools: [
        {
          type: "function",
          function: {
            name: "generate_website_review",
            description: "Generate a structured website review",
            parameters: zodToJsonSchema(WebsiteReviewSchema)
          }
        }
      ]
    });

    // Handle the response
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI API");
    }

    // Parse the JSON response
    const analysis = JSON.parse(content);

    return {
      content: analysis,
      metadata: {
        url,
        timestamp: new Date().toISOString(),
        model: "gpt-4",
        tokens: {
          prompt: response.usage?.prompt_tokens || 0,
          completion: response.usage?.completion_tokens || 0,
          total: response.usage?.total_tokens || 0
        }
      }
    };

  } catch (error) {
    console.error('Error in website review:', error);
    throw error;
  }
};

export const getWebsiteReview = withRetry(reviewWebsite, { retries: 3, delay: 1000, onRetry: (error: Error) => console.warn('Retrying reviewWebsite due to error:', error) });

