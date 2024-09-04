import { generateContentUsecase } from "@services/content-generator/usecases/generate-content.usecase"
import { ContentGenerationJob } from "src/services/content-generator/metadata/content.schema"
import { SQSEvent , SQSRecord } from "aws-lambda"


export const contentGeneratorJobAdapter = async (event: SQSEvent) => {
    if (!event.Records || event.Records.length === 0) {
        throw new Error("Missing SQS Records")
    }
    // Pull the transcript here with a usecase and pass it into the job
    // Create a persistent cache outside the function scope

    const results = await Promise.all(event.Records.map(async (record: SQSRecord) => {
        const body = JSON.parse(record.body);
        const contentGenerationJob: ContentGenerationJob = {
            id: body.jobId,
            userId: body.userId,
            prompt: body.prompt,
            status: body.status,
            createdAt: body.createdAt,
            updatedAt: body.updatedAt
        };
        return await generateContentUsecase(contentGenerationJob);
    }));

    return {
        statusCode: 200,
        body: JSON.stringify(results)
    };
}
