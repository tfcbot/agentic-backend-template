import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Job, Queue } from "@control-plane/user/metadata/job.schema";
import { ContentGenerationJob } from "@orchestrator/metadata/content-generator-service.schema";

const sqsClient = new SQSClient({});

//@ts-ignore
import { Resource } from "sst";

//@ts-ignore-function
function getQueueUrlForJobType(queue: Queue): string {
    switch (queue) {
      case Queue.content:
        //@ts-ignore
        return Resource.JobQueue.url;
      case Queue.content:
        //@ts-ignore
        return Resource.AgentQueue.url;
      case Queue.user:
        //@ts-ignore
        return Resource.UserQueue.url;
      default:
        throw new Error(`Unknown queue type: ${queue}`);
    }
}

export const publishEvent = async(job: Job | ContentGenerationJob ): Promise<void> => {
  const queueUrl = getQueueUrlForJobType(job.queue);
  try {
    await sqsClient.send(new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(job),
    }));
  } catch (error) {
    console.error('Error emitting event:', error);
    throw new Error('Failed to emit event');
  }
}