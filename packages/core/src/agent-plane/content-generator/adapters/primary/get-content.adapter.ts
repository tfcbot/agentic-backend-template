
import { GetContentInput, GetContentOutput } from '@agent-plane/content-generator/metadata/content-generator.schema';
import { getContentUseCase } from '@agent-plane/content-generator/usecases/get-content.usecase';

export class GetContentAdapter {
  async execute(input: GetContentInput): Promise<GetContentOutput[]> {
    try {
      console.info("Getting content data for user");
      const contentData = await getContentUseCase(input);
      return contentData;
    } catch (error) {
      console.error('Error in GetContentAdapter:', error);
      throw new Error('Failed to retrieve content data');
    }
  }
}

export const getContentAdapter = new GetContentAdapter();
