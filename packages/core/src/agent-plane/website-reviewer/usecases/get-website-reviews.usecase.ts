import { GetWebsiteReviewsInput, GetWebsiteReviewsOutput } from '@agent-plane/website-reviewer/metadata/website-reviewer.schema';
import { websiteReviewRepository } from '../adapters/secondary/datastore.adapter';


export const getWebsiteReviewsUseCase = async (input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput> => {
  console.info("Getting website reviews for User: ", input.userId);

  try {
    const reviews = await websiteReviewRepository.getReviews(input.userId);
    return { reviews: reviews }
  } catch (error) {
    console.error('Error retrieving website reviews:', error);
    throw new Error('Failed to retrieve website reviews');
  }
};


