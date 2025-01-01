import { UUID } from "crypto";


export enum Status {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed'
}

import { z } from 'zod';

export enum Topic {
    tasks = 'tasks',
}

export enum Queue {
    content = 'content',
    user = 'user',
    image = 'image',
    score = 'score',
    poll = 'poll',
    feedback = 'feedback',
    experiment = 'experiment',
    returnCredits = 'returnCredits'
}

export const TaskSchema = z.object({
    taskId: z.string().uuid(),
    userId: z.string(),
    apiKey: z.string(),
    topic: z.nativeEnum(Topic),
    queue: z.nativeEnum(Queue),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    payload: z.object({})
})

export type Task = z.infer<typeof TaskSchema>;



