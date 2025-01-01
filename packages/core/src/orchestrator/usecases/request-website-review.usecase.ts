

import {  Queue, Topic, WebsiteReviewTask } from '@orchestrator/metadata/task.schema'
import { ReviewWebsiteInput } from '@orchestrator/metadata/agent-plane.schema'
import { TopicPublisher } from '@orchestrator/adapters/secondary/topic-publisher.adapter';
import { randomUUID } from 'crypto';
import { Message } from '@utils/metadata/message.schema';

export async function publishWebsiteReviewTaskUseCase(request: ReviewWebsiteInput): Promise<Message> {
  try {
    const task: WebsiteReviewTask = {
      taskId: randomUUID(),
      userId: request.userId,
      topic: Topic.tasks,
      queue: Queue.websiteReview,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      payload: {
        websiteUrl: request.websiteUrl
      }
    }

    const publisher = new TopicPublisher();
    await publisher.publishTask(task);

    return {
      message: 'Website review task published',
      data: {
        reviewId: task.taskId,
        url: request.websiteUrl
      }
    }

  } catch (error) {
    console.error('Error in scoringUseCase:', error);
    throw new Error('Failed to publish scoring event');
  }
}
