
export const agentInputPrompt = async (functionName: string, parameters: any, structuredOutput: string) => 
    `Execute the ${functionName} function with the following parameters: ${JSON.stringify(parameters)}. 
    Return the output in JSON format without any additional text or comments with the following schema: ${structuredOutput}`;