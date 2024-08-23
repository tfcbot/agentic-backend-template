import { UUID } from "crypto";


export enum Status {
    Pending = 'pending',
    Processing = 'processing',
    Completed = 'completed',
    Failed = 'failed'
}

export enum Queue {
    video = 'video',
    content = 'content',
    user = 'user'
}

export interface Job {
    jobId: UUID;
    userId: string;
    status: Status;
    queue: Queue;
    createdAt: string;
    updatedAt: string;
}



