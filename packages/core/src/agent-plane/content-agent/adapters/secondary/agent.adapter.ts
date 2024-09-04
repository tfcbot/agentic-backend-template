import { 
    BedrockRuntimeClient,
    InvokeModelCommandInput, 
    InvokeModelCommand, 
    ConverseCommand, 
    ConverseCommandInput,
    Message, 
    ConversationRole, 
    DocumentFormat
} from "@aws-sdk/client-bedrock-runtime";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { ContentGenerationCommand } from "@agent-plane/content-agent/metadata/agent";

//@ts-ignore
import { Resource } from "sst";

const bedrockRuntime = new BedrockRuntimeClient();
const sqsClient = new SQSClient({});



export const generateContent = async (command: ContentGenerationCommand ): Promise<string> => {
    console.log("Executing Bedrock Runtime")
    const conversation: Message[] = [
        {
            role: 'user' as ConversationRole, 
            content: [
                {
                    text: command.prompt
                }, 
            ],
        },
    ];
   
    const input: ConverseCommandInput = {
        modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        messages: conversation
    };
    
    try {
        const converseCommand = new ConverseCommand(input);
        const response = await bedrockRuntime.send(converseCommand);
        console.log("Recieved Response From Converse API:", response)
        if (response.output?.message?.content?.[0]?.text) {
            const data = response.output.message.content[0].text
            return response.output.message.content[0].text;
        } else {
            throw new Error('No valid response from the model');
        }
    } catch (error) {
        console.error('Error generating content:', error);
        throw new Error(`Failed to generate content: ${error}`);
    }
};




export const publishEvent = async (message: any): Promise<void> => {
    await sqsClient.send(new SendMessageCommand({
        QueueUrl: process.env.EVENT_QUEUE_URL,
        MessageBody: JSON.stringify(message),
    }));
};