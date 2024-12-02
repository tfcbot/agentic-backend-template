// Inputs from Orchestrator
import { GetRemainingCreditsInput, GetRemainingCreditsOutput } from '@orchestrator/metadata/credits.schema';
import {  GetExperimentOutput } from '@orchestrator/metadata/experiment.schema';
import { GetExperimentMetricsInput } from '@agent-plane/metrics-manager/metadata/metrics.schema';
import { userAdapter} from '@control-plane/user/adapters/primary/get-remaining-responses.adapter';
import { IUserAdapter } from '@orchestrator/metadata/user.schema';
import { getExperimentMetricsAdapter } from '@agent-plane/metrics-manager/adapters/primary/get-experiment-metrics';

export interface IServiceAdapter {
  getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput>;
}
// Adapter for Orchestrator
export class ServicesAdapter implements IServiceAdapter {
  private userAdapter: IUserAdapter;
  constructor(userAdapter: IUserAdapter) {
    this.userAdapter = userAdapter;
  }

  async getRemainingCredits(input: GetRemainingCreditsInput): Promise<GetRemainingCreditsOutput> {
    return userAdapter.getRemainingCredits(input);
  }

  async getExperimentMetrics(input: GetExperimentMetricsInput): Promise<GetExperimentOutput[]> {
    return getExperimentMetricsAdapter.execute(input);
  }


}

export const servicesAdapter = new ServicesAdapter(userAdapter);