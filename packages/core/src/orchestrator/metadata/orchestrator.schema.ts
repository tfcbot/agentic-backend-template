import { UUID } from "crypto";

export enum Status {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed',
}

export enum Queue {
    content = 'content',
}

export interface Task {
    taskId: UUID;
    userId: string;
    status: Status;
    queue: Queue;
    createdAt: string;
    updatedAt: string;
}