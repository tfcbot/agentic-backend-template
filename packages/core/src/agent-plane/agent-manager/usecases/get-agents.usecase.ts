import { GetAgentsInput, GetAgentsOutput } from '@agent-plane/agent-manager/metadata/agents.schema';
import { agentsRepository } from '@agent-plane/agent-manager/adapters/secondary/datastore.adapter';

export async function getAgentsUseCase(input: GetAgentsInput): Promise<GetAgentsOutput[]> {
  try {
    const agents = await agentsRepository.getAgents(input);
    return agents;
  } catch (error) {
    console.error('Error in getAgentsUseCase:', error);
    throw new Error('Failed to retrieve agents');
  }
}
