import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { createUserAdapter } from '@control-plane/user/adapters/primary/create-user.adapter';
import { getUserDataAdapter } from '@control-plane/user/adapters/primary/get-user-data.adapter';
import { Webhook } from "svix";
import { PaymentStatus, OnboardingStatus } from '@control-plane/user/metadata/user.schema';
import { userCreatedEvent } from '../__mocks__/auth-events';

const ddbMock = mockClient(DynamoDBDocumentClient);

const mockVerify = jest.fn().mockReturnValue(userCreatedEvent);

jest.mock('svix', () => ({
  Webhook: jest.fn().mockImplementation(() => ({
    verify: mockVerify
  }))
}));

jest.mock('@utils/jwt', () => ({
  authMiddleware: jest.fn().mockReturnValue({ sub: 'mockUserId123' }),
}));

jest.mock('sst', () => ({
  Resource: {
    Users: { tableName: 'MockUserTable' },
  }
}));

describe('User Authentication Flow Integration', () => {
  beforeEach(() => {
    ddbMock.reset();
    jest.clearAllMocks();
    process.env.CLERK_WEBHOOK_SECRET = 'mock-clerk-webhook-secret';
    mockVerify.mockClear();
  });

  it('should process user creation and retrieval', async () => {
    // Mock the user creation webhook event
    const mockCreateUserEvent: Partial<APIGatewayProxyEventV2> = {
        body: JSON.stringify({
          object: 'event',
          type: 'user.created',
          data: {"test": "test"}
        }),
        headers: {
          'svix-id': 'mock-svix-id',
          'svix-timestamp': 'mock-svix-timestamp',
          'svix-signature': 'mock-svix-signature'
        }
      };

    // Mock DynamoDB put operation
    ddbMock.on(PutCommand).resolves({});

    // Process user creation
    const createUserResult: APIGatewayProxyResultV2 = await createUserAdapter(mockCreateUserEvent as APIGatewayProxyEventV2);
    const parsedCreateUserResult = JSON.parse(JSON.stringify(createUserResult));

    expect(parsedCreateUserResult.statusCode).toBe(200);
    expect(JSON.parse(parsedCreateUserResult.body)).toEqual({ message: 'User created successfully' });

    // Verify DynamoDB put call
    const dynamoPutCall = ddbMock.call(0);
    expect(dynamoPutCall.args[0].input).toMatchObject({
      TableName: 'MockUserTable',
      Item: {
        userId: 'mockUserId123',
        paymentStatus: PaymentStatus.notPaid,
        onboardingStatus: OnboardingStatus.inProgress
      }
    });

    // Verify that wh.verify was called with the correct arguments

    // Mock the get user data event
    const mockGetUserEvent: Partial<APIGatewayProxyEventV2> = {
      headers: {
        authorization: 'Bearer mockToken',
      },
    };

    // Mock DynamoDB get operation
    ddbMock.on(GetCommand).resolves({
      Item: {
        userId: 'mockUserId123',
        paymentStatus: PaymentStatus.notPaid,
        onboardingStatus: OnboardingStatus.inProgress
      }
    });

    // Process get user data
    const getUserResult: APIGatewayProxyResultV2 = await getUserDataAdapter(mockGetUserEvent as APIGatewayProxyEventV2);
    const parsedGetUserResult = JSON.parse(JSON.stringify(getUserResult));

    expect(parsedGetUserResult.statusCode).toBe(200);
    expect(JSON.parse(parsedGetUserResult.body)).toEqual({
      userId: 'mockUserId123',
      paymentStatus: PaymentStatus.notPaid,
      onboardingStatus: OnboardingStatus.inProgress
    });

    // Verify DynamoDB get call
    const dynamoGetCall = ddbMock.call(1);
    expect(dynamoGetCall.args[0].input).toMatchObject({
      TableName: 'MockUserTable',
      Key: { userId: 'mockUserId123' }
    });
  });

  it('should handle errors during user creation', async () => {
    const mockCreateUserEvent: Partial<APIGatewayProxyEventV2> = {
      body: JSON.stringify({
        type: 'user.created',
        data: {
          id: 'mockUserId123',
          email_addresses: [{ email_address: 'test@example.com' }],
          first_name: 'John',
          last_name: 'Doe'
        }
      }),
      headers: {
        'svix-id': 'mock-svix-id',
        'svix-timestamp': 'mock-svix-timestamp',
        'svix-signature': 'mock-svix-signature'
      }
    };

    // Mock DynamoDB put operation to throw an error
    ddbMock.on(PutCommand).rejects(new Error('DynamoDB error'));

    const createUserResult: APIGatewayProxyResultV2 = await createUserAdapter(mockCreateUserEvent as APIGatewayProxyEventV2);
    const parsedCreateUserResult = JSON.parse(JSON.stringify(createUserResult));

    expect(parsedCreateUserResult.statusCode).toBe(500);
    expect(JSON.parse(parsedCreateUserResult.body)).toEqual({ error: 'Internal Server Error' });
  });

  it('should handle unauthorized access when getting user data', async () => {
    const mockGetUserEvent: Partial<APIGatewayProxyEventV2> = {
      headers: {
        // Missing authorization header
      },
    };

    // Mock authMiddleware to throw an error
    (jest.requireMock('@utils/jwt').authMiddleware as jest.Mock).mockImplementation(() => {
      throw new Error('No token provided');
    });

    const getUserResult: APIGatewayProxyResultV2 = await getUserDataAdapter(mockGetUserEvent as APIGatewayProxyEventV2);
    const parsedGetUserResult = JSON.parse(JSON.stringify(getUserResult));

    expect(parsedGetUserResult.statusCode).toBe(401);
    expect(JSON.parse(parsedGetUserResult.body)).toEqual({ error: 'Unauthorized' });
  });

  it('should handle webhook verification failure', async () => {
    const mockCreateUserEvent: Partial<APIGatewayProxyEventV2> = {
      body: JSON.stringify({
        type: 'user.created',
        data: {
          id: 'mockUserId123',
          email_addresses: [{ email_address: 'test@example.com' }],
          first_name: 'John',
          last_name: 'Doe'
        }
      }),
      headers: {
        'svix-id': 'mock-svix-id',
        'svix-timestamp': 'mock-svix-timestamp',
        'svix-signature': 'mock-svix-signature'
      }
    };

    mockVerify.mockImplementationOnce(() => {
      throw new Error('Invalid signature');
    });

    const createUserResult: APIGatewayProxyResultV2 = await createUserAdapter(mockCreateUserEvent as APIGatewayProxyEventV2);
    const parsedCreateUserResult = JSON.parse(JSON.stringify(createUserResult));

    expect(parsedCreateUserResult.statusCode).toBe(400);
    expect(JSON.parse(parsedCreateUserResult.body)).toEqual({ error: 'Error verifying webhook' });
  });
});