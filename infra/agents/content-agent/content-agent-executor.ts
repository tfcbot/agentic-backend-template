const lambdaRole = new aws.iam.Role("ExecutorLambdaRole", {
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

// Attach the AWSLambdaBasicExecutionRole managed policy to the role
new aws.iam.RolePolicyAttachment("LambdaBasicExecutionRoleAttachment", {
    role: lambdaRole.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
});

// Define the inline policy for the role
new aws.iam.RolePolicy("LambdaPolicy", {
    role: lambdaRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "sqs:SendMessage",
                    "sqs:ReceiveMessage",
                    "sqs:DeleteMessage",
                    "sqs:GetQueueAttributes",
                    "sqs:GetQueueUrl",
                    "s3:GetObject",
                    "s3:ListBucket",
                    "s3:GetBucketLocation",
                    "bedrock:ListFoundationModels",
                    "bedrock:GetFoundationModel",
                    "bedrock:TagResource", 
                    "bedrock:UntagResource", 
                    "bedrock:ListTagsForResource", 
                    "bedrock:CreateAgent", 
                    "bedrock:UpdateAgent", 
                    "bedrock:GetAgent", 
                    "bedrock:ListAgents", 
                    "bedrock:DeleteAgent",
                    "bedrock:CreateAgentActionGroup", 
                    "bedrock:UpdateAgentActionGroup", 
                    "bedrock:GetAgentActionGroup", 
                    "bedrock:ListAgentActionGroups", 
                    "bedrock:DeleteAgentActionGroup",
                    "bedrock:GetAgentVersion",
                    "bedrock:ListAgentVersions", 
                    "bedrock:DeleteAgentVersion",
                    "bedrock:CreateAgentAlias", 
                    "bedrock:UpdateAgentAlias",               
                    "bedrock:GetAgentAlias",
                    "bedrock:ListAgentAliases",
                    "bedrock:DeleteAgentAlias",
                    "bedrock:AssociateAgentKnowledgeBase",
                    "bedrock:DisassociateAgentKnowledgeBase",
                    "bedrock:GetKnowledgeBase",
                    "bedrock:ListKnowledgeBases",
                    "bedrock:PrepareAgent",
                    "bedrock:InvokeAgent",
                    "bedrock:InvokeModel",
                    "lambda:InvokeFunction",
                    "kms:Decrypt",
                    "kms:GenerateDataKey",
                    "kms:DescribeKey",
                    "aws-marketplace:Subscribe",
                    "aws-marketplace:Unsubscribe",
                    "aws-marketplace:ViewSubscriptions"
                ],
                Resource: "*"
            },
            {
                Effect: "Allow",
                Action: [
                    "dynamodb:PutItem",
                    "dynamodb:GetItem",
                    "dynamodb:UpdateItem"
                ],
                Resource: "arn:aws:dynamodb:*:*:*"
            }
        ]
    }),
});

export const executorLambda = new sst.aws.Function("executor", {
    handler: "./packages/functions/src/agents.executors.agentExecutor", 
    role: lambdaRole.arn,
    link: [], // Add Additional Resources here like tables, buckets etc.
    timeout: '300 seconds'
});

// Add resource-based policy to allow Bedrock to invoke the Lambda function
new aws.lambda.Permission("AllowBedrockInvoke", {
    action: "lambda:InvokeFunction",
    function: executorLambda.name,
    principal: "bedrock.amazonaws.com",
    statementId: "AllowBedrockInvoke",
});