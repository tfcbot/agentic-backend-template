import { z } from 'zod';
export enum Status {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed',
}

export enum Queue {
    content = 'content',
    websiteReview = 'websiteReview',
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


export const WebsiteReviewTaskSchema = TaskSchema.extend({
  payload: z.object({
    websiteUrl: z.string(),
  }),
});


export type WebsiteReviewTask = z.infer<typeof WebsiteReviewTaskSchema>
export type Task = z.infer<typeof TaskSchema>

export type taskType =
  | WebsiteReviewTask;