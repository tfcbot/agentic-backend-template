
import { agentPlaneAdapter } from '@orchestrator/adapters/secondary/agent-plane.adapters';
import { GetWebsiteReviewsInput, GetWebsiteReviewsOutput } from '../metadata/agent-plane.schema';

export const getWebsiteReviewsUseCase = async (input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput> => {
  try {
    console.log('Calling Adapter')
    return await agentPlaneAdapter.getWebsiteReviews(input);
  } catch (error: any) {
    console.error('Error fetching user content:', error);
    throw new Error('Failed to fetch user content: ' + error.message);
  }
};