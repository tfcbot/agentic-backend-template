import { contentRepository } from '@agent-plane/content-generator/adapters/secondary/datastore.adapter';
import { GetContentInput, GetContentOutput   } from '../metadata/content-generator.schema';


export const getContentUseCase = async (input: GetContentInput): Promise<GetContentOutput[]> => {
  try {
    const contentData: GetContentOutput[] = await contentRepository.getContent(input);

    return contentData;
  } catch (error) {
    console.error('Error in getContentUseCase:', error);
    throw new Error('Failed to retrieve content data');
  }
};
