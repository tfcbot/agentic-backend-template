import { Agent, AgentSchema } from "../metadata/agent.schema";

export interface GetAgentsUseCase {
    execute(): Promise<Agent[]>;
}

export interface AgentSecondaryPort {
    getAgents(): Promise<Agent[]>;
}

export class GetAgentsUseCaseImpl implements GetAgentsUseCase {
    constructor(
        private readonly agentSecondaryPort: AgentSecondaryPort
    ) {}

    async execute(): Promise<Agent[]> {
        return await this.agentSecondaryPort.getAgents();
    }
}

