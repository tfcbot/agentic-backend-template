import { GetUserContentInput, GetUserContentOutput } from 'src/services/content-generator/metadata/content.schema';
import { fetchUserContentUseCase } from '@services/content-generator/usecases/fetch-content.usecase';

export class GetUserContentAdapter {
  async execute(input: GetUserContentInput): Promise<GetUserContentOutput> {
    console.log("Executing adapter")
    const content = await fetchUserContentUseCase(input.userId);
    return content;
  }
}