import { GenerateRequest } from "@agent-plane/agent/metadata/agent"

export const agentGenerateUseCase = async (input: GenerateRequest ): Promise<string> => {
    return "Hello World";
};