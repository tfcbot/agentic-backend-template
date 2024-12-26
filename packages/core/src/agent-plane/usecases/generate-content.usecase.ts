import { ContentDTO, ContentTaskInput, Status } from '@agent-plane/content-generator/metadata/content-generator.schema';
import { randomUUID } from 'crypto';
import { contentRepository } from '../adapters/secondary/datastore.adapter';
import { generateContent } from '../adapters/secondary/openai.adapter';
import { GenerateContentCommandOutput } from '../metadata/content-agent.schema';

export const generateContentUsecase = async (contentTask: ContentTaskInput) => {
        console.info("Generating Content for User: ", contentTask.userId);
       
        const output: GenerateContentCommandOutput = await generateContent(contentTask.prompt);
        const contentDTO: ContentDTO = {
                contentId: randomUUID(),
                text: output.content,
                userId: contentTask.userId,
        };
        console.info("Content generated, saving to database")
        await contentRepository.saveContent(contentDTO);
};