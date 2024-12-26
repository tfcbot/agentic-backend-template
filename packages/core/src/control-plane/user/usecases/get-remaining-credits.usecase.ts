import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from '@control-plane/user/metadata/credits.schema';
import { apiKeyAdapter } from '@control-plane/user/adapters/secondary/api-key.adapter';

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
