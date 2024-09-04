import { GenerateContentInput, ContentGenerationJob } from '@orchestrator/metadata/content-generator-service.schema';
import { Status, Queue } from '@orchestrator/metadata/orchestrator.schema';
import { publishEvent } from '@orchestrator/adapters/secondary/event-publisher.adapter';
import { randomUUID } from 'crypto';
// ... existing imports ...

export async function generateContentUseCase(jobInput: GenerateContentInput): Promise<void> {
  try {
    const job: ContentGenerationJob = {
      jobId: randomUUID(),
      userId: jobInput.userId,
      prompt: jobInput.prompt,
      status: Status.Pending,
      queue: Queue.content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await publishEvent(job);

  } catch (error) {
    console.error('Error in generateContentUseCase:', error);
    throw new Error('Failed to publish content generation events');
  }
}
