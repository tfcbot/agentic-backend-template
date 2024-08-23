import { ResponseState } from "@aws-sdk/client-bedrock-agent-runtime";
import { 
    AgentInputEvent, 
    AgentResponse,
    GenerateRequestSchema,
} from "@agent-plane/agent/metadata/agent"
import { agentGenerateUseCase } from "@agent-plane/agent/usecases/generate.usecase"

export const agentHandler = async (event: AgentInputEvent): Promise<AgentResponse> => {
    const functionName = event.function;
    const parameters = event.parameters || [];

    let usecaseResponse; 
    let input; 
    switch (functionName) {
        case "generate":
            console.log('Agent Invoking Generate')
            input = GenerateRequestSchema.parse(parameters) 
            console.log("Input:", input)
            usecaseResponse = await agentGenerateUseCase(input);
            break;
        default:
            throw new Error(`Unknown function: ${functionName}`);
    }
    
    const responseBody = {
        TEXT: {
            body: JSON.stringify(usecaseResponse)
        }
    };

    const functionResponse = {
        actionGroup: event.actionGroup,
        function: event.function,
        functionResponse: {
            responseState: ResponseState.FAILURE,
            responseBody: responseBody
        }, 
    };

    const response: AgentResponse = {
        messageVersion: '1.0',
        sessionAttributes: event.sessionAttributes,
        promptSessionAttributes: event.promptSessionAttributes,
        response: functionResponse
    };

    return response;
}