import { SQSEvent, SQSRecord } from 'aws-lambda';
import { FeedbackTaskInput } from '@agent-plane/feedback-generator/metadata/feedback-generator.schema';
import { generateFeedbackUseCase } from '@agent-plane/feedback-generator/usecases/generate-feedback.usecase';

export const feedbackGenerationAdapter = async (event: SQSEvent) => {
    console.info("--- Feedback Generation Queue Adapter ---");
    if (!event.Records || event.Records.length === 0) {
        throw new Error("Missing SQS Records");
    }

    const results = await Promise.all(event.Records.map(async (record: SQSRecord) => {
        const body = JSON.parse(record.body);
        const FeedbackTask: FeedbackTaskInput = {
            experimentId: body.experimentId,
            experimentImpressionCount: body.experimentImpressionCount,
            experimentTitle: body.experimentTitle,
            userId: body.userId,
        };
        console.info("Generating Feedback for Experiment: ", FeedbackTask);
        return await generateFeedbackUseCase(FeedbackTask);
    }));

    return results;
};