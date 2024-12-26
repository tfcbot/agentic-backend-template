import { ContentSchema } from 'src/orchestrator/metadata/task.schema';
import { z } from 'zod';

export interface AgentConfig {
  agentId: string;
  agentAliasId: string;
  functionName: string;
  getParameters: (input: any) => Record<string, any>;
};


export enum Status {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Failed = 'Failed',
}

export type ContentDTO = z.infer<typeof ContentSchema>;

export const GetContentInputSchema = z.object({
  userId: z.string(),
});

export const GetContentOutputSchema = z.object({
  content: z.array(ContentSchema),
});

export const ContentTaskInputSchema = z.object({
  userId: z.string(),
  prompt: z.string(),
});

// Export types 
export type GetContentInput = z.infer<typeof GetContentInputSchema>;
export type GetContentOutput = z.infer<typeof GetContentOutputSchema>;
export type ContentTaskInput = z.infer<typeof ContentTaskInputSchema>;