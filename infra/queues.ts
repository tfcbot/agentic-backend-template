import { websiteReviewTable } from "./database"


export const DLQ = new sst.aws.Queue("DLQ")

export const websiteReviewQueue = new sst.aws.Queue("WebsiteReviewQueue")

const subscriberRole = new aws.iam.Role("QueueSubscriberRole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    Service: "lambda.amazonaws.com"
                },
                Action: "sts:AssumeRole"
            }
        ]
    }),
});

new aws.iam.RolePolicy("QueueSubscriberPolicy", {
    role: subscriberRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "bedrock:InvokeAgent",
                    "lambda:InvokeFunction",
                    "sqs:SendMessage",
                    "sqs:ReceiveMessage",
                    "sqs:DeleteMessage",
                    "sqs:GetQueueAttributes",
                    "sqs:GetQueueUrl",
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem"
                ],
                Resource: ["*"]
            }
        ]
    }),
});



    
websiteReviewQueue.subscribe({
        handler: "./packages/functions/src/agent-plane.api.websiteReviewHandler", 
        link: [
           websiteReviewTable
        ],
        environment: {
        }, 
        permissions: [
            {
                actions: ["dynamodb:*"], 
                resources: [websiteReviewTable.arn]
            }
        ]
    }, 
)
