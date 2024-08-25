import { agentAlias, agentResource } from "./agents"
import { bucket } from "./bucket"
import { usersTable } from "./database"


export const DLQ = new sst.aws.Queue("JobDLQ")

export const jobQueue = new sst.aws.Queue("JobQueue")

const subscriberRole = new aws.iam.Role("JobQueueSubscriberRole", {
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

new aws.iam.RolePolicy("JobQueueSubscriberPolicy", {
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

jobQueue.subscribe(
    { 
        handler: "./packages/functions/src/services.api.jobHandler",
        link: [ usersTable]
    },
    {filters : [
        {
            body : {
                jobId : [{exists : true}]
            }
        }
    ]}
)


export const AgentQueue = new sst.aws.Queue("AgentQueue")
    
AgentQueue.subscribe({
        handler: "./packages/functions/src/services.api.agentHandler", 
        link: [
            bucket, 
            usersTable, 
            agentResource, 
            agentAlias,
            subscriberRole
        ],
        environment: {
            CONTENT_AGENT_ID: agentResource.agentId, 
            CONTENT_AGENT_ALIAS_ID: agentAlias.agentAliasId
        }, 
        permissions: [
            {
                actions: ["bedrock:*"], 
                resources: ["*"]
            }
        ]
    }, 
        {filters : [
            {
                body : {
                    jobId : [{exists : true}]
                }
            }
        ]},

)

export const userQueue = new sst.aws.Queue("UserQueue")

userQueue.subscribe({
    handler: "./packages/functions/src/control-plane.api.handleSettingsSubscriber",
    link: [usersTable]
})