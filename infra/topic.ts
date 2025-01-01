import { websiteReviewQueue } from "./queues"


// Topics
export const tasksTopic = new sst.aws.SnsTopic("TasksTopic")


// Tasks Subscribers 
tasksTopic.subscribeQueue(websiteReviewQueue.arn, {
    filter: {
        "queue": ["websiteReview"]
      }
})
