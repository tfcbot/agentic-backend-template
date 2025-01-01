import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from "@orchestrator/metadata/credits.schema"
import { agentPlaneAdapter } from '@orchestrator/adapters/secondary/agent-plane.adapters';

export const getRemainingCreditsUseCase = async (input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> => {
  try {
    const result = await agentPlaneAdapter.getRemainingCredits(input);
    return result;
  } catch (error) {
    console.error('Error in getCurrentCreditsUseCase:', error);
    throw new Error('Failed to get current credits');
  }
};
