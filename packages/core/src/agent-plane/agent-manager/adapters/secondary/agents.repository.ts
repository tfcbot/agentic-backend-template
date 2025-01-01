import { DynamoDBDocumentClient, QueryCommand, GetCommand, GetCommandOutput, QueryCommandOutput, PutCommand } from "@aws-sdk/lib-dynamodb";
import { GetAgentsInput, GetAgentsOutput, GetAgentByIdInput, GetAgentByIdOutput, CreateAgentInput, CreateAgentOutput } from "@agent-plane/agent-manager/metadata/agents.schema";

// @ts-ignore
import { Resource } from "sst";

export interface IAgentsRepository {
  getAgents(input: GetAgentsInput): Promise<GetAgentsOutput[]>;
  getAgentById(input: GetAgentByIdInput): Promise<GetAgentByIdOutput>;
  createAgent(input: CreateAgentInput): Promise<CreateAgentOutput>;
}

class AgentsRepository implements IAgentsRepository {
  constructor(private dbClient: DynamoDBDocumentClient) {}

  async createAgent(input: CreateAgentInput): Promise<CreateAgentOutput> {
    console.info("Creating agent in database via AgentsRepository");
    try {
      const params = {
        TableName: Resource.AgentsTable.tableName,
        Item: input
      };
      await this.dbClient.send(new PutCommand(params));
      return { message: "Agent created successfully" };
    } catch (error) {
      console.error("Error creating agent:", error);
      throw new Error("Failed to create agent");
    }
  }

  async getAgents(input: GetAgentsInput): Promise<GetAgentsOutput[]> {
    console.info("Getting agents from database via AgentsRepository");
    try {
      const params = {
        TableName: Resource.AgentsTable.tableName,
      };
      const agents: QueryCommandOutput = await this.dbClient.send(new QueryCommand(params));

      return agents.Items as GetAgentsOutput[];

    } catch (error) {
      console.error("Error getting agents:", error);
      throw new Error("Failed to get agents");
    }
  }
  
  async getAgentById(input: GetAgentByIdInput): Promise<GetAgentByIdOutput> {
    console.info("Getting agent by id from database via AgentsRepository");
    try {
      const params = {
        TableName: Resource.AgentsTable.tableName,
        Key: {
          agentId: input.agentId
        }
      };
      const agent: GetCommandOutput = await this.dbClient.send(new GetCommand(params));
      return agent.Item as GetAgentByIdOutput;
    } catch (error) {
      console.error("Error getting agent by id:", error);
      throw new Error("Failed to get agent by id");
    }
  }
}

export const createAgentsRepository = (dbClient: DynamoDBDocumentClient): IAgentsRepository => new AgentsRepository(dbClient);