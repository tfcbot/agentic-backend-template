import { invokeContentAgent } from '@services/content-generator/adapters/secondary/content-agent.adapter';
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { ContentGenerationJob, Status } from "@services/content-generator/metadata/content.schema";
import { mockClient } from "aws-sdk-client-mock";
import { randomUUID } from "crypto";

jest.mock('sst', () => ({
  Resource: {
    // Add any necessary mock resources here
  }
}));

const bedrockAgentMock = mockClient(BedrockAgentRuntimeClient);

describe('Content Management Adapter', () => {
  beforeEach(() => {
    bedrockAgentMock.reset();
    process.env.CONTENT_AGENT_ID = 'mock-agent-id';
    process.env.CONTENT_AGENT_ALIAS_ID = 'mock-agent-alias-id';
  });

  it('should throw an error if CONTENT_AGENT_ID is not set', async () => {
    delete process.env.CONTENT_AGENT_ID;
    const mockJob: ContentGenerationJob = {
      id: randomUUID(),
      userId: 'user123',
      prompt: 'Create a post',
      status: Status.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await expect(invokeContentAgent(mockJob)).rejects.toThrow('CONTENT_AGENT_ID is not set');
  });

  it('should throw an error if CONTENT_AGENT_ALIAS_ID is not set', async () => {
    delete process.env.CONTENT_AGENT_ALIAS_ID;
    const mockJob: ContentGenerationJob = {
      id: randomUUID(),
      userId: 'user123',
      prompt: 'Create a post',
      status: Status.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await expect(invokeContentAgent(mockJob)).rejects.toThrow('CONTENT_AGENT_ALIAS_ID is not set');
  });


  it('should handle errors from the Bedrock Agent', async () => {
    const mockJob: ContentGenerationJob = {
      id: randomUUID(),
      userId: 'user123',
      prompt: 'Create a post',
      status: Status.Pending,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    bedrockAgentMock.on(InvokeAgentCommand).rejects(new Error('Bedrock Agent error'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(invokeContentAgent(mockJob)).rejects.toThrow('Bedrock Agent error');


    consoleErrorSpy.mockRestore();
  });
});