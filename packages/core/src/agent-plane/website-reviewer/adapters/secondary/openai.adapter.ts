import OpenAI from "openai";
import { WebsiteReview, websiteReviewAgentSystemPrompt, WebsiteReviewSchema } from "@agent-plane/website-reviewer/metadata/website-reviewer.schema";

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
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: websiteReviewAgentSystemPrompt() },
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
   
    
    // Handle tool calls if present
    if (response.choices[0].message.tool_calls) {
      const toolCall = response.choices[0].message.tool_calls[0];
      if (toolCall.function.name === 'generate_website_review') {
        const review = JSON.parse(toolCall.function.arguments);
        return review;
      }
    }

    // If no tool calls, parse the content directly
    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI API");
    }

    // Parse the JSON response
    const analysis = JSON.parse(content);

    return analysis;
  } catch (error) {
    console.error('Error in website review:', error);
    throw error;
  }
};

export const runWebsiteReview = withRetry(reviewWebsite, { retries: 3, delay: 1000, onRetry: (error: Error) => console.warn('Retrying reviewWebsite due to error:', error) });

