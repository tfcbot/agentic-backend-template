import { GetUserContentAdapter } from '@services/content-generator/adapters/primary/get-user-content.adapter';
import { GetUserContentInput, GetUserContentOutput } from '@orchestrator/metadata/content-generator-service.schema';

const getUserContentAdapter = new GetUserContentAdapter();

export const servicesAdapter = {
  getUserContent: (input: GetUserContentInput): Promise<GetUserContentOutput> => getUserContentAdapter.execute(input)
};