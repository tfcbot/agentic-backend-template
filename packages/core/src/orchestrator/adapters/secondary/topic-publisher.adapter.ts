import { SNSClient, PublishCommand } from "@aws-sdk/client-sns"
import { Task } from "@orchestrator/metadata/task.schema";
import { Topic } from "@orchestrator/metadata/task.enum"

//@ts-ignore
import { Resource } from "sst";

export class TopicPublisher {
  private snsClient: SNSClient;
  private topicArns: Record<Topic, string>;

  constructor() {
    this.snsClient = new SNSClient({});
    this.topicArns = {
      [Topic.tasks]: Resource.TasksTopic.arn,
    
  
    };
  }

  async publishTask(task: Task): Promise<void> {
    const topicArn = this.topicArns[task.topic];
    try {
      await this.snsClient.send(new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(task.payload),
        MessageAttributes: {
          queue: {
            DataType: 'String',
            StringValue: task.queue
          }
        }
      }));
    } catch (error) {
      console.error('Error publishing to topic:', error);
      throw new Error('Failed to publish to topic');
    }
  }
}

export const topicPublisher = new TopicPublisher();
