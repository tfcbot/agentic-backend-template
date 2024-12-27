import { GetAgentsInput, GetAgentsOutput } from '@orchestrator/metadata/agent.schema';
import { ReviewWebsiteInput, ReviewWebsiteOutput } from '@orchestrator/metadata/agent.schema';
import { GetWebsiteReviewsInput, GetWebsiteReviewsOutput } from '@orchestrator/metadata/agent.schema';
import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from '@orchestrator/metadata/agent.schema';
import {GetAgentsAdapter } from "src/agent-plane/agent-manager/adapters/primary/get-agents.adapter"
import {GetWebsiteReviewsAdapter} from "src/agent-plane/website-reviewer/adapters/primary/get-website-reviews.adapter"
import { userAdapter } from '@control-plane/user/adapters/primary/get-remaining-credits';
import { IUserAdapter } from '@orchestrator/metadata/user.schema';

export interface IAgentPlaneAdapter {
  getAgents(getAgentsInput: GetAgentsInput): Promise<GetAgentsOutput[]>;
  getWebsiteReviews(input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput[]>;
  getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput>;
}

class AgentPlaneAdapter implements IAgentPlaneAdapter {
  private getAgentsAdapter: GetAgentsAdapter;
  private getWebsiteReviewsAdapter: GetWebsiteReviewsAdapter;
  private userAdapter: IUserAdapter;

  constructor() {
    this.getAgentsAdapter = new GetAgentsAdapter();
    this.getWebsiteReviewsAdapter = new GetWebsiteReviewsAdapter();
    this.userAdapter = userAdapter;
  }

  async getAgents(input: GetAgentsInput): Promise<GetAgentsOutput[]> {  
    return this.getAgentsAdapter.execute(input);
  }

  async getWebsiteReviews(input: GetWebsiteReviewsInput): Promise<GetWebsiteReviewsOutput[]> {
    return this.getWebsiteReviewsAdapter.execute(input);
  }

  async getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    return this.userAdapter.getRemainingCredits(input);
  }
}

export const agentPlaneAdapter = new AgentPlaneAdapter();
