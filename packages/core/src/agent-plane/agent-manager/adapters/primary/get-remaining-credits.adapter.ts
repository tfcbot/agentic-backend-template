import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from '@orchestrator/metadata/agent.schema';
import { getRemainingCreditsUseCase } from '@agent-plane/agent-manager/usecases/get-remaining-credits.usecase';

export class GetRemainingCreditsAdapter {
  async execute(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    try {
      const result = await getRemainingCreditsUseCase(input);
      return result;
    } catch (error) {
      console.error('Error in GetRemainingCreditsAdapter:', error);
      throw new Error('Failed to retrieve remaining credits');
    }
  }
}

export const getRemainingCreditsAdapter = new GetRemainingCreditsAdapter();
