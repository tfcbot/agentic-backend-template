import { GetWebsiteReviewsInput, GetWebsiteReviewsOutput } from '@orchestrator/metadata/agent.schema';
import { getWebsiteReviewsUseCase } from 'src/agent-plane/website-reviewer/usecases/get-website-reviews.usecase';


export class GetWebsiteReviewsAdapter {
  async execute(input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput[]> {
    try {
      const result = await getWebsiteReviewsUseCase(input);
      return result;
    } catch (error) {
      console.error('Error in GetWebsiteReviewsAdapter:', error);
      throw new Error('Failed to retrieve website reviews');
    }
  }
}

export const getWebsiteReviewsAdapter = new GetWebsiteReviewsAdapter();
