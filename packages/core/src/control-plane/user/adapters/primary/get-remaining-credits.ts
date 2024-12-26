import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from '@control-plane/user/metadata/credits.schema';
import { getRemainingCreditsUseCase } from '@control-plane/user/usecases/get-remaining-credits.usecase';


export class UserAdapter {
  async getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    const result = await getRemainingCreditsUseCase(input);
    return result;
  }
}

export const userAdapter = new UserAdapter();
