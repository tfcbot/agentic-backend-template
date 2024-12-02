import { GenerateContentInput, ContentGenerationTask } from '@orchestrator/metadata/content-generator.schema';
import { Status, Queue } from '@orchestrator/metadata/orchestrator.schema';
import { publishEvent } from '@orchestrator/adapters/secondary/event-publisher.adapter';
import { randomUUID } from 'crypto';
import { Message } from '@utils/metadata/message.schema'


export async function generateContentUseCase(jobInput: GenerateContentInput): Promise<Message> {
  try {
    const task: ContentGenerationTask = {
      taskId: randomUUID(),
      userId: jobInput.userId,
      prompt: jobInput.prompt,
      status: Status.Pending,
      queue: Queue.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await publishEvent(task);
    return {
      message: "Content generation task published",
      data: task.taskId
    }
  } catch (error) {
    console.error('Error in generateContentUseCase:', error);
    throw new Error('Failed to publish content generation events');
  }
}
