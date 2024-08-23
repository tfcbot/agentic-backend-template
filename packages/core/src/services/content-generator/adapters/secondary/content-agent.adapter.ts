import { BedrockAgentRuntimeClient, InvokeAgentCommand, InvokeAgentCommandInput, InvokeAgentCommandOutput, InvokeAgentResponse } from "@aws-sdk/client-bedrock-agent-runtime";
import { ContentGenerationJob, Tone } from "src/services/content-generator/metadata/content.schema";

const bedrockAgentClient = new BedrockAgentRuntimeClient({ region: process.env.AWS_REGION });

//@ts-ignore
import { Resource } from "sst";

export const invokeContentAgent = async (contentGenerationJob: ContentGenerationJob): Promise<any> => {
    
    console.log("Agent Invokation Process Starting")
    const agentId = process.env.CONTENT_AGENT_ID;
    const agentAliasId = process.env.CONTENT_AGENT_ALIAS_ID;
    if (!agentId) {
        throw new Error('CONTENT_AGENT_ID is not set');
    }

    if (!agentAliasId) {
        throw new Error('CONTENT_AGENT_ALIAS_ID is not set');
    }
    console.log("Agent:", agentId)
    console.log('Agent Alias', agentAliasId)
    console.log("Agent variables set")

    const agentInputText = `Follow ${contentGenerationJob.prompt} and
     create a post for target platform: ${contentGenerationJob.targetPlatform}. Based on 
     ${contentGenerationJob.videoId} for ${contentGenerationJob.userId}`


    const agentInput: InvokeAgentCommandInput = {
        agentId: agentId,
        agentAliasId: agentAliasId,
        inputText: agentInputText,
        sessionId: contentGenerationJob.id
    };


    const command = new InvokeAgentCommand(agentInput);
    try {
        const response: InvokeAgentCommandOutput = await bedrockAgentClient.send(command);
        console.log("Agent Invoked:", response)
        return response    
    } catch (error) {
        console.error("Error invoking content agent:", error);
        throw error;
    }
};
