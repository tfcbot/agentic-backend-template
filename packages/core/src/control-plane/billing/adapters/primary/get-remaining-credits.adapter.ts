import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from 'src/control-plane/billing/metadata/credits.schema';
import { getRemainingCreditsUseCase } from 'src/control-plane/billing/usecases/get-remaining-credits.usecase';


export class CreditsAdapter {
  async getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    const result = await getRemainingCreditsUseCase(input);
    return result;
  }
}

export const creditsAdapter = new CreditsAdapter();