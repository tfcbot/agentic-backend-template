import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Job, Queue } from "@control-plane/user/metadata/job.schema";
import { UserSettings, UserSettingsJob } from '@control-plane/user/metadata/user.schema';

const sqsClient = new SQSClient({});

//@ts-ignore
import { Resource } from "sst";

function getQueueUrlForJobType(queue: Queue): string {
    switch (queue) {
      case Queue.content:
        return Resource.jobQueue.url;
      case Queue.agent:
        return Resource.AgentQueue.url;
      case Queue.user:
        return Resource.userQueue.url;
      default:
        throw new Error(`Unknown queue type: ${queue}`);
    }
}

export const publishEvent = async(job: Job | UserSettingsJob ): Promise<void> => {
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