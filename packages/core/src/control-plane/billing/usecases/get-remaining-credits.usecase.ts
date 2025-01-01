import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from 'src/control-plane/billing/metadata/credits.schema';
import { apiKeyAdapter } from '@control-plane/billing/adapters/secondary/api-key.adapter';

export async function getRemainingCreditsUseCase(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
  try {
    const remainingCredits = await apiKeyAdapter.getRemainingCredits(input.keyId);
    return {
        credits: remainingCredits
    }
  } catch (error) {
    console.error('Error in getRemainingCreditsUseCase:', error);
    throw new Error('Failed to get remaining credits');
  }
}
