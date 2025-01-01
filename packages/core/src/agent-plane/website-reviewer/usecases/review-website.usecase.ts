import { ReviewWebsiteInput, ReviewWebsiteOutput } from '@agent-plane/website-reviewer/metadata/website-reviewer.schema';
import { reviewWebsite } from '@agent-plane/website-reviewer/adapters/secondary/openai.adapter';

export const reviewWebsiteUsecase = async (input: ReviewWebsiteInput): Promise<ReviewWebsiteOutput> => {
  console.info("Reviewing website for User: ", input.userId);

  try {
    const result = await reviewWebsite(input.websiteUrl);
    
    return {
      review: result
    };

  } catch (error) {
    console.error('Error generating website review:', error);
    throw new Error('Failed to generate website review');
  }
};
