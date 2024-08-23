import { getUserContent} from '@services/content-generator/adapters/secondary/datastore.adapter';
import { Content } from '@services/content-generator/metadata/content.schema'; 
import { GetUserContentOutput } from '@services/content-generator/metadata/content.schema'; 

export const fetchUserContentUseCase = async (userId: string): Promise<GetUserContentOutput> => {
  console.log('Calling Services Usecase')
  try {
    const content: Content[] = await getUserContent(userId);
    return { content }
  } catch (error) {
    console.error('Error in fetchContentUseCase:', error);
    throw new Error('Failed to fetch content');
  }
};
