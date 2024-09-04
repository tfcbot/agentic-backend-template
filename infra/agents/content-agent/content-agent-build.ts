import { executorLambda } from "./content-agent-executor";

const bedrockAgentRole = new aws.iam.Role("BedrockAgentRole", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Principal: {
                    Service: "bedrock.amazonaws.com"
                },
                Action: "sts:AssumeRole"
            }
        ]
    }),
});

new aws.iam.RolePolicyAttachment("BedrockAgentBasicExecutionRoleAttachment", {
    role: bedrockAgentRole.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

new aws.iam.RolePolicy("BedrockAgentPolicy", {
    role: bedrockAgentRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: "bedrock:InvokeModel",
                Resource: [
                    "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-instant-v1",
                    "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1",
                    "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0", 
                    "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0", 
                    "arn:aws:bedrock:us-west-2::foundation-model/meta.llama3-1-405b-instruct-v1:0"
                ]
            },
            {
                Effect: "Allow",
                Action: [
                    "lambda:InvokeFunction",
                    "bedrock:*",
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

const prompt = `You are a helpful assistant and follow instruction to generate content.`

const customFunction = {
    name: "customFunctionName",
    description: "Custom function description  ",
    parameters: {
        parameterName: {
            type: awsnative.bedrock.AgentType.String, 
            description: "description of parameter", 
            required: true
        }
    },
};

                
const agentFunctions = [customFunction]



export const agentResource = new awsnative.bedrock.Agent("BedrockAgent", {
    agentName: "ContentAgent",
    agentResourceRoleArn: bedrockAgentRole.arn,
    foundationModel: "anthropic.claude-3-sonnet-20240229-v1:0",
    instruction: prompt,
    autoPrepare: true, 
    actionGroups: [{
        actionGroupName: "AgentActionGroupFunctions",
        actionGroupExecutor: {
            lambda: executorLambda.arn,
            
        },
        actionGroupState: awsnative.bedrock.AgentActionGroupState.Enabled,
        description: "helpful agent",
        functionSchema: {
            functions: agentFunctions,
        },
    }],
});

export const agentAlias = new awsnative.bedrock.AgentAlias("AgentAlias", {
   agentId: agentResource.agentId
})