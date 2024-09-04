import { z } from 'zod';

// Custom enums (can be customized as needed)
export enum CustomEnum {
    Value1 = "Value1",
    Value2 = "Value2",
    // Add more values as needed
}

// Input schema
export const InputSchema = z.object({
    // Add fields as needed
    userId: z.string(),
    someField: z.string(),
    someEnum: z.nativeEnum(CustomEnum),
});

// Agent input event schema
export const AgentInputEventSchema = z.object({
    messageVersion: z.literal('1.0'),
    agent: z.object({
        name: z.string(),
        id: z.string(),
        alias: z.string(),
        version: z.string()
    }),
    inputText: z.string(),
    sessionId: z.string(),
    actionGroup: z.string(),
    function: z.string(),
    parameters: z.array(z.object({
        name: z.string(),
        type: z.string(),
        value: z.string()
    })),
    sessionAttributes: z.record(z.string()),
    promptSessionAttributes: z.record(z.string())
});

// Agent response schema
export const AgentResponseSchema = z.object({
    messageVersion: z.literal('1.0'),
    response: z.object({
        actionGroup: z.string(),
        function: z.string(),
        functionResponse: z.object({
            responseState: z.enum(['FAILURE', 'REPROMPT']),
            responseBody: z.record(z.object({
                body: z.string().refine(str => {
                    try {
                        JSON.parse(str);
                        return true;
                    } catch {
                        return false;
                    }
                }, {
                    message: 'Must be a JSON-formatted string'
                })
            }))
        })
    }),
    sessionAttributes: z.record(z.string()),
    promptSessionAttributes: z.record(z.string())
});

// Generate request schema
export const ContentRequestSchema = z.array(
  z.object({
    name: z.string(),
    type: z.string(),
    value: z.string(),
  })
).transform((arr) => {
  const result: { [key: string]: string } = {};
  arr.forEach((item) => {
    result[item.name] = item.value;
  });
  return z.object({
    prompt: z.string(),
    userId: z.string()
  }).parse(result);
});


export const ContentGenerationCommandSchema = z.object({
    prompt: z.string(),
    userId: z.string(), 
})

export const ContentSchema = z.object({
    userId: z.string(),
    contentId: z.string().uuid(),
    text: z.string(),
});


// Export types
export type AgentInputEvent = z.infer<typeof AgentInputEventSchema>;
export type AgentResponse = z.infer<typeof AgentResponseSchema>;
export type Input = z.infer<typeof InputSchema>;
export type ContentRequest = z.infer<typeof ContentRequestSchema>;
export type ContentGenerationCommand = z.infer<typeof ContentGenerationCommandSchema>;
export type Content = z.infer<typeof ContentSchema>;
// Add more schemas and types as needed