import { z } from 'zod';
import { TargetPlatform, Tone } from './content.schema';

export const AgentInputEventSchema = z.object({
    agent: z.string(),
    actionGroup: z.string(),
    function: z.string(),
    parameters: z.array(z.object({
        name: z.string(),
        value: z.string()
    })),
    sessionAttributes: z.record(z.string()),
    promptSessionAttributes: z.record(z.string())
});

export type AgentInputEvent = z.infer<typeof AgentInputEventSchema>;

export const AgentResponseSchema = z.object({
    response: z.object({
        functionResponse: z.object({
            responseState: z.enum(['FAILURE', 'SUCCESS']),
            responseBody: z.object({
                TEXT: z.object({
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
                })
            })
        })
    })
});

export type AgentResponse = z.infer<typeof AgentResponseSchema>;

export const ContentBriefSchema = z.object({
    videoId: z.string(),
    briefId: z.string(),
    userId: z.string(),
    targetPlatform: z.nativeEnum(TargetPlatform),
    tone: z.nativeEnum(Tone),
    keypoints: z.string()
});

export type ContentBrief = z.infer<typeof ContentBriefSchema>;
