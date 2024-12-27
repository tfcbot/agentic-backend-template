import { ReviewWebsiteInput, ReviewWebsiteOutput } from '@orchestrator/metadata/agent.schema';
import { reviewWebsite } from 'src/agent-plane/website-reviewer/adapters/secondary/openai.adapter';

export const reviewWebsiteUsecase = async (input: ReviewWebsiteInput): Promise<ReviewWebsiteOutput> => {
  console.info("Reviewing website for User: ", input.userId);

  try {
    const result = await reviewWebsite(input.websiteUrl);
    
    return {
      review: result.review
    };

  } catch (error) {
    console.error('Error generating website review:', error);
    throw new Error('Failed to generate website review');
  }
};
