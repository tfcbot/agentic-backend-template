import { GetWebsiteReviewsInput, GetWebsiteReviewsOutput } from '@orchestrator/metadata/agent-plane.schema';
import {GetWebsiteReviewsAdapter} from "@agent-plane/website-reviewer/adapters/primary/get-website-reviews.adapter"
import { CreditsAdapter, creditsAdapter } from '@control-plane/billing/adapters/primary/get-remaining-credits.adapter';
import { GetRemainingCreditsOutput, GetRemainingCreditsInput } from '@control-plane/billing/metadata/credits.schema';


export interface IAgentPlaneAdapter {
  getWebsiteReviews(input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput>;
  getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput>;
}

class AgentPlaneAdapter implements IAgentPlaneAdapter {
  private getWebsiteReviewsAdapter: GetWebsiteReviewsAdapter;
  private creditsAdapter: CreditsAdapter;

  constructor() {
    this.getWebsiteReviewsAdapter = new GetWebsiteReviewsAdapter();
    this.creditsAdapter = creditsAdapter;
  }


  async getWebsiteReviews(input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput> {
    return this.getWebsiteReviewsAdapter.execute(input);
  }

  async getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    return this.creditsAdapter.getRemainingCredits(input);
  }
}

export const agentPlaneAdapter = new AgentPlaneAdapter();
