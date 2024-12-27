import { GetWebsiteReviewsInput, GetWebsiteReviewsOutput } from '@orchestrator/metadata/agent.schema';

export const getWebsiteReviewsUseCase = async (input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput[]> => {
  console.info("Getting website reviews for User: ", input.userId);

  try {
    // This usecase should be implemented by injecting a repository/adapter
    // to handle data access, rather than directly accessing DynamoDB
    throw new Error('Repository not implemented');
  } catch (error) {
    console.error('Error retrieving website reviews:', error);
    throw new Error('Failed to retrieve website reviews');
  }
};


