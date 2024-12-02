import { GetContentInput, GetContentOutput } from '@orchestrator/metadata/content-generator.schema'
import { GetContentAdapter } from 'src/agent-plane/content-generator/adapters/primary/get-content.adapter';

export interface IAgentPlaneAdapter {
  getContent(input: GetContentInput): Promise<GetContentOutput[]>;

}

class AgentPlaneAdapter implements IAgentPlaneAdapter {
  private getContentAdapter: GetContentAdapter;
  
  constructor() {
    this.getContentAdapter = new GetContentAdapter();
  }

  async getContent(input: GetContentInput): Promise<GetContentOutput[]> {
    return this.getContentAdapter.execute(input);
  }
}

export const agentPlaneAdapter = new AgentPlaneAdapter();