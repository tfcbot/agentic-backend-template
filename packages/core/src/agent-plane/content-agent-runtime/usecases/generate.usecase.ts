import { ContentGenerationCommand, ContentRequest, Content } from "src/agent-plane/content-agent-runtime/metadata/agent"
import { saveContent } from "src/agent-plane/content-agent-runtime/adapters/secondary/database.adapter"
import { generateContent } from "src/agent-plane/content-agent-runtime/adapters/secondary/agent.adapter"
import { randomUUID } from "crypto";

export const agentGenerateUseCase = async (input: ContentRequest ): Promise<Content> => {
    const command: ContentGenerationCommand = {
        prompt: input.prompt,
        userId: input.userId
    }
    const output = await generateContent(command)
    const content: Content = {
        userId: input.userId,
        contentId: randomUUID(),
        text: output
    }
    await saveContent(content)
    return content
};