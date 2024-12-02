import { contentTable } from "./database"


export const DLQ = new sst.aws.Queue("ContentDLQ")

export const contentQueue = new sst.aws.Queue("ContentQueue")

const subscriberRole = new aws.iam.Role("ContentQueueSubscriberRole", {
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

new aws.iam.RolePolicy("ContentQueueSubscriberPolicy", {
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



    
contentQueue.subscribe({
        handler: "./packages/functions/src/agent-plane.api.contentGenerationHandler", 
        link: [
           contentTable
        ],
        environment: {
        }, 
        permissions: [
            {
                actions: ["dynamodb:*"], 
                resources: [contentTable.arn]
            }
        ]
    }, 
)
