
export const generateContentPrompt = (structuredOutput: string) => `

Return your response in JSON string format only with no other text or characters:

${structuredOutput}`;
