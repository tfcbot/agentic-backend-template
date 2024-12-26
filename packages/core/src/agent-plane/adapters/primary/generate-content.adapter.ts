import { SQSEvent, SQSRecord } from 'aws-lambda';
import { ContentTaskInput } from '@agent-plane/content-generator/metadata/content-generator.schema';
import { generateContentUsecase } from 'src/agent-plane/usecases/generate-content.usecase';

export const contentGenerationAdapter = async (event: SQSEvent) => {
    console.info("--- Content Generation Queue Adapter ---");
    if (!event.Records || event.Records.length === 0) {
        throw new Error("Missing SQS Records");
    }

    const results = await Promise.all(event.Records.map(async (record: SQSRecord) => {
        const body = JSON.parse(record.body);
        const ContentTask: ContentTaskInput = {
            userId: body.userId,
            prompt: body.prompt,
        };
        console.info("Generating Content for Experiment: ", ContentTask);
        return await generateContentUsecase(ContentTask);
    }));

    return results;
};