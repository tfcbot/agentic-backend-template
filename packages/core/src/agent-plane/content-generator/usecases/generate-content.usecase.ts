import { CreateExperimentInput } from '@agent-plane/feedback-generator/metadata/feedback-generator.schema';
import { GenerateFeedbackCommandOutput, Status } from '@agent-plane/feedback-generator/metadata/feedback-agent.schema';
import { FeedbackDTO } from '@agent-plane/feedback-generator/metadata/feedback-generator.schema';
import { randomUUID } from 'crypto';
import { feedbackRepository, experimentMetricsRepository } from '@agent-plane/feedback-generator/adapters/secondary/datastore.repository';
import { feedbackPrep, getFeedback } from '@agent-plane/feedback-generator/adapters/secondary/openai.adapter';
import { FeedbackPrepOutput } from '@agent-plane/feedback-generator/metadata/feedback-agent.schema';
import { FeedbackTaskInput } from '@agent-plane/feedback-generator/metadata/feedback-generator.schema';

export const generateFeedbackUseCase = async (feedbackTask: FeedbackTaskInput) => {
        console.info("Generating Feedback for Experiment: ", feedbackTask.experimentId);
        const context: FeedbackPrepOutput = await feedbackPrep(feedbackTask);
        const experimentStatus = await experimentMetricsRepository.getExperimentStatus(feedbackTask.experimentId);
        if (experimentStatus === Status.Completed) {
            console.info("Experiment already completed, stopping feedback generation");
            return;
        }
        const experimentImpressionCount = await experimentMetricsRepository.checkExperimentImpressionCount(feedbackTask.experimentId);
        if (experimentImpressionCount) {
            console.info("Experiment impression count reached, stopping feedback generation");
            await experimentMetricsRepository.updateExperimentStatus({ experimentId: feedbackTask.experimentId, status: Status.Completed });
            return;
        }
        const generatedFeedback: GenerateFeedbackCommandOutput = await getFeedback(context);
        console.info("Feedback generated", generatedFeedback);
        const feedbackDTO: FeedbackDTO = {
                feedbackId: randomUUID(),
                experimentId: feedbackTask.experimentId,
                experimentTitle: feedbackTask.experimentTitle,
                selectedVariationId: generatedFeedback.selectedVariationId,
                response: generatedFeedback.response,
                userId: feedbackTask.userId,
                experimentImpressionCount: feedbackTask.experimentImpressionCount
        };
        console.info("Feedback generated, saving to database")
        await feedbackRepository.saveFeedback(feedbackDTO);
};