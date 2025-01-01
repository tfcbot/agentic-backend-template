import { GetRemainingCreditsOutput, GetRemainingCreditsInput } from '@control-plane/billing/metadata/credits.schema';
import { CreditsAdapter, creditsAdapter } from '@control-plane/billing/adapters/primary/get-remaining-credits.adapter';


export interface IControlPlaneAdapter {
  getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput>;
}

class ControlPlaneAdapter implements IControlPlaneAdapter {
  private creditsAdapter: CreditsAdapter;

  constructor() {
    this.creditsAdapter = creditsAdapter;
  }

  async getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    return this.creditsAdapter.getRemainingCredits(input);
  }
}

export const controlPlaneAdapter = new ControlPlaneAdapter();
