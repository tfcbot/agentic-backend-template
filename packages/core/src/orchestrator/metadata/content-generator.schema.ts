import { z } from 'zod';
import { Status, Queue } from "@orchestrator/metadata/orchestrator.schema";
import { HttpResponses, createHttpResponse, HttpResponseParams, HttpStatusCode } from '@utils/tools/http-status';
import { Message } from '@utils/metadata/message.schema';
import { ContentSchema } from './task.schema';


export const GenerateContentInputSchema = z.object({
  userId: z.string(),
  prompt: z.string(),
});

export const ContentGenerationTaskSchema = z.object({
  taskId: z.string().uuid(),
  userId: z.string(),
  prompt: z.string(), 
  status: z.nativeEnum(Status),
  queue: z.nativeEnum(Queue),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const ContentGenerationTaskResponseSchema = z.object({
  message: z.string(),
  data: ContentGenerationTaskSchema
})

export const GetContentInputSchema = z.object({
  userId: z.string(),
})

export const GetContentOutputSchema = z.object({
  content: z.array(ContentSchema)
})

export const GetContentResponseBodySchema = z.object({
  message: z.string(),
  data: GetContentOutputSchema
})

export type ContentGenerationTaskResponse = z.infer<typeof ContentGenerationTaskResponseSchema>
export type ContentGenerationTask = z.infer<typeof ContentGenerationTaskSchema>
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;
export type GetContentInput = z.infer<typeof GetContentInputSchema>;
export type GetContentOutput = z.infer<typeof GetContentOutputSchema>;

export const ContentGeneratorHttpResponses = {
  ...HttpResponses,
  CONTENT_GENERATED: (params: HttpResponseParams<Message>) =>   
    createHttpResponse(HttpStatusCode.CREATED, params),
}

