import { contentQueue } from "./queues"


// Topics
export const tasksTopic = new sst.aws.SnsTopic("TasksTopic")


// Tasks Subscribers 
tasksTopic.subscribeQueue(contentQueue.arn, {
    filter: {
        "queue": ["content"]
      }
})
