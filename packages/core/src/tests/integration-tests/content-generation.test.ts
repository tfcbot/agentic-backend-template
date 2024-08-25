import { mockClient } from 'aws-sdk-client-mock';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { randomUUID } from 'crypto';
import { APIGatewayProxyResultV2, APIGatewayProxyEventV2, SQSEvent } from 'aws-lambda';
import { authMiddleware } from '@utils/jwt';
import { aiGeneratorHandler } from '@orchestrator/adapters/primary/content-generator-service.adapter';
import { contentGeneratorJobAdapter } from '@services/content-generator/adapters/primary/content-generator.adapter';
import { TargetPlatform, Tone } from '@services/content-generator/metadata/content.schema';
import { BedrockAgentRuntimeClient, InvokeAgentCommand, InvokeAgentCommandOutput } from "@aws-sdk/client-bedrock-agent-runtime";

jest.mock('@utils/jwt', () => ({
  authMiddleware: jest.fn().mockReturnValue({ sub: 'mockUserId' }),
}));

const s3Mock = mockClient(S3Client);
const dynamoMock = mockClient(DynamoDBClient);
const sqsMock = mockClient(SQSClient);
const bedrockAgentMock = mockClient(BedrockAgentRuntimeClient);

jest.mock('sst', () => ({
  Resource: {
    JobQueue: { url: 'MockVideoQueueUrl' },
    AgentQueue: { url: 'MockAgentQueueUrl' },
    UserQueue: { url: 'MockUserQueueUrl' }
  }
}));

describe('Content Generation Integration', () => {
  beforeEach(() => {
    s3Mock.reset();
    dynamoMock.reset();
    sqsMock.reset();
    bedrockAgentMock.reset();
    jest.clearAllMocks();
    process.env.CONTENT_AGENT_ID = 'mock-agent-id';
    process.env.CONTENT_AGENT_ALIAS_ID = 'mock-agent-alias-id';
  });

  it('should process a content generation request through orchestrator to services', async () => {
    const mockVideoId = randomUUID();
    const mockUserId = 'mockUserId123';
    const mockJobId = randomUUID();
    (authMiddleware as jest.Mock).mockReturnValue({ sub: mockUserId });

    // Mock the orchestrator input
    const mockEvent: Partial<APIGatewayProxyEventV2> = {
      body: JSON.stringify({
        videoIds: [mockVideoId],
        prompts: {
          [TargetPlatform.LinkedIn]: 'Create a professional post',
          [TargetPlatform.Twitter]: 'Write a catchy tweet'
        },
        targetPlatforms: [TargetPlatform.LinkedIn, TargetPlatform.Twitter]
      }),
      headers: {
        authorization: 'Bearer mockToken',
      },
    };

    // Mock SQS send message
    sqsMock.on(SendMessageCommand).resolves({
      MessageId: mockJobId
    });

    // Orchestrator result
    const orchestratorResult: APIGatewayProxyResultV2 = await aiGeneratorHandler(mockEvent as APIGatewayProxyEventV2);
    const parsedOrchestratorResult = JSON.parse(JSON.stringify(orchestratorResult));
    
    expect(parsedOrchestratorResult.statusCode).toBe(200);
    expect(authMiddleware).toHaveBeenCalledWith(mockEvent);
    expect(sqsMock.calls()).toHaveLength(2); // One call for each target platform

    // Mock SQS event for content generator
    const mockSQSEvent: SQSEvent = {
      Records: [
        {
          messageId: mockJobId,
          receiptHandle: 'mock-receipt-handle',
          body: JSON.stringify({
            jobId: mockJobId,
            userId: mockUserId,
            videoId: mockVideoId,
            targetPlatform: TargetPlatform.LinkedIn,
            prompt: 'Create a professional post',
            status: 'Pending',
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
          }),
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1645966814987',
            SenderId: '123456789012',
            ApproximateFirstReceiveTimestamp: '1645966814988'
          },
          messageAttributes: {},
          md5OfBody: 'mock-md5',
          eventSource: 'aws:sqs',
          eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:mock-queue',
          awsRegion: 'us-east-1'
        }
      ]
    };

    // Mock Bedrock Agent response
    const mockInvokeAgentResponse: Partial<InvokeAgentCommandOutput> = {
      completion: {
        [Symbol.asyncIterator]: async function* () {
          yield {
            chunk: {
              bytes: new TextEncoder().encode("Mocked response text"),
              attribution: {
                citations: []
              }
            }
          };
        }
      },
      contentType: "application/json",
      sessionId: "mock-session-id",
      $metadata: {}
    };
    
    bedrockAgentMock.on(InvokeAgentCommand).resolves(mockInvokeAgentResponse);

    // Publish the job to the content generator
    const body = await contentGeneratorJobAdapter(mockSQSEvent);
    const parsedContentGeneratorResult = JSON.parse(JSON.stringify(body));

    expect(parsedContentGeneratorResult.statusCode).toBe(200);
    const parsedBody = JSON.parse(parsedContentGeneratorResult.body);
    expect(parsedBody).toBeInstanceOf(Array);
    expect(parsedBody).toHaveLength(1);
    expect(parsedBody[0]).toEqual({
      $metadata: {},
      completion: {},
      contentType: "application/json",
      sessionId: "mock-session-id"
    });
    expect(bedrockAgentMock.calls()).toHaveLength(1);

    // Verify Bedrock Agent call
    const bedrockCall = bedrockAgentMock.call(0);
    expect(bedrockCall.args[0].input).toMatchObject({
      agentId: 'mock-agent-id',
      agentAliasId: 'mock-agent-alias-id',
      inputText: expect.stringContaining('Create a professional post'),
      sessionId: expect.any(String)
    });
  });
});