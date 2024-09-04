import { servicesAdapter } from '@orchestrator/adapters/secondary/services-adapter';
import { GetUserContentInput, GetUserContentOutput } from '@orchestrator/metadata/content-generator-service.schema';

export const getUserContentUseCase = async (input: GetUserContentInput): Promise<GetUserContentOutput> => {
  try {
    console.log('Calling Adapter')
    return await servicesAdapter.getUserContent(input);
  } catch (error: any) {
    console.error('Error fetching user content:', error);
    throw new Error('Failed to fetch user content: ' + error.message);
  }
};