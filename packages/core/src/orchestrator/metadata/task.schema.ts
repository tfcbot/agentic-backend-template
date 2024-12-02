import { z } from 'zod';
export enum Status {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed',
}

export enum Queue {
    content = 'content',
}

export enum Topic {
    tasks = 'tasks',
}

export const TaskSchema = z.object({
  taskId: z.string().uuid(),
  userId: z.string(),
  topic: z.nativeEnum(Topic),
  queue: z.nativeEnum(Queue),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  payload: z.object({})
})



export const ContentSchema = z.object({
  userId: z.string(),
  contentId: z.string().uuid(),
  text: z.string(),
})

export const GetUserContentInputSchema = z.object({
  userId: z.string(),
})

export const GetUserContentOutputSchema = z.object({
  content: z.array(ContentSchema)
});


export const GenerateContentInputSchema = z.object({
  userId: z.string(),
  prompt: z.string(),
});

export const ContentGenerationTaskSchema = TaskSchema.extend({
  payload: z.object({
    prompt: z.string(),
  }),
});



export type ContentGenerationTask = z.infer<typeof ContentGenerationTaskSchema>
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;
export type GetUserContentInput = z.infer<typeof GetUserContentInputSchema>; 
export type GetUserContentOutput = z.infer<typeof GetUserContentOutputSchema>; 
export type Task = z.infer<typeof TaskSchema>

export type taskType =
  | ContentGenerationTask;
