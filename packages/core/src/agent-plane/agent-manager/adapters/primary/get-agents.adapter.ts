import { GetAgentsInput, GetAgentsOutput } from '@orchestrator/metadata/agent.schema';
import { getAgentsUseCase } from '@agent-plane/usecases/get-agents.usecase';

export class GetAgentsAdapter {
  async execute(input: GetAgentsInput): Promise<GetAgentsOutput[]> {
    try {
      const result = await getAgentsUseCase(input);
      return result;
    } catch (error) {
      console.error('Error in GetAgentsAdapter:', error);
      throw new Error('Failed to retrieve agents');
    }
  }
}

export const getAgentsAdapter = new GetAgentsAdapter();
