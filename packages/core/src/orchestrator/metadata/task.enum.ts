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

export enum Topic {
    tasks = 'tasks',
}