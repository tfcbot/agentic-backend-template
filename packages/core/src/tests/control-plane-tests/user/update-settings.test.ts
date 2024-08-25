import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { createUserUseCase } from '@control-plane/user/usecases/create-user.usecase';
import { getUserDataUseCase } from '@control-plane/user/usecases/get-user-data.usecase';
import { updateSettingsUseCase } from '@control-plane/user/usecases/update-settings.usecase'
import { createUser, getUserData, updateUserSettings } from '@control-plane/user/adapters/secondary/user-management.adapter';
import { publishEvent } from '@control-plane/user/adapters/secondary/event-publisher.adapter';
import { getUserDataAdapter } from '@control-plane/user/adapters/primary/get-user-data.adapter';
import { updateSettingsPublisher} from '@control-plane/user/adapters/primary/update-settings-publisher.adapter';
import { updateSettingsSubscriber } from '@control-plane/user/adapters/primary/update-settings-subscriber.adapter';
import { NewUser, User, PaymentStatus, OnboardingStatus, UserSettings, UserSettingsJob } from '@control-plane/user/metadata/user.schema';
import { Queue, Status } from '@control-plane/user/metadata/job.schema';
import { APIGatewayProxyEventV2, SQSEvent } from 'aws-lambda';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { authMiddleware, verifyJwt } from '@utils/jwt';

jest.mock('svix');
// Mock SST Resource
jest.mock('sst', () => ({
  Resource: {
    Users: {
      tableName: 'MockedUsersTable',
    },
    ContentQueue: {
      url: 'https://mocked-content-queue-url',
    },
    VideoQueue: {
      url: 'https://mocked-video-queue-url',
    },
    UserQueue: {
      url: 'https://mocked-user-queue-url',
    },
  },
}));

jest.mock('@utils/jwt', () => ({
  verifyJwt: jest.fn().mockReturnValue({ sub: 'mockUserId' }),
  authMiddleware: jest.fn().mockReturnValue({ sub: 'mockUserId' }),
}));

const dynamoMock = mockClient(DynamoDBClient);
const dynamoDocumentMock = mockClient(DynamoDBDocumentClient);
const sqsMock = mockClient(SQSClient);

describe('@user module tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dynamoMock.reset();
    dynamoDocumentMock.reset();
    sqsMock.reset();
  });

  describe('Usecases', () => {
    describe('createUserUseCase', () => {
      it('should create a new user successfully', async () => {
        const newUser: NewUser = {
          userId: 'user123',
          paymentStatus: PaymentStatus.notPaid,
          onboardingStatus: OnboardingStatus.notStarted,
        };

        dynamoDocumentMock.on(PutCommand).resolves({});

        await createUserUseCase(newUser);

        expect(dynamoDocumentMock.calls()).toHaveLength(1);
      });

      it('should throw an error if user creation fails', async () => {
        const newUser: NewUser = {
          userId: 'user123',
          paymentStatus: PaymentStatus.notPaid,
          onboardingStatus: OnboardingStatus.notStarted,
        };

        dynamoDocumentMock.on(PutCommand).rejects(new Error('DynamoDB error'));

        await expect(createUserUseCase(newUser)).rejects.toThrow('User creation failed');
      });
    });

    describe('getUserDataUseCase', () => {
      it('should get user data successfully', async () => {
        const mockUser: User = {
          userId: 'user123',
          paymentStatus: PaymentStatus.paid,
          onboardingStatus: OnboardingStatus.complete,
        };

        dynamoDocumentMock.on(GetCommand).resolves({ Item: mockUser });

        const result = await getUserDataUseCase('user123');

        expect(result).toEqual(mockUser);
        expect(dynamoDocumentMock.calls()).toHaveLength(1);
        expect(dynamoDocumentMock.call(0).args[0].input).toEqual({
          TableName: 'MockedUsersTable',
          Key: { userId: 'user123' },
        });
      });

      it('should throw an error if user data retrieval fails', async () => {
        dynamoDocumentMock.on(GetCommand).rejects(new Error('DynamoDB error'));

        await expect(getUserDataUseCase('user123')).rejects.toThrow('User data retrieval failed');
      });
    });

    describe('updateSettingsUseCase', () => {
      it('should update publish event successfully', async () => {
        const settings: UserSettings = {
          userId: 'user123',
          brandStyleTone: 'Professional',
          coreMessaging: 'Innovative solutions',
          visionStatement: 'Transform industries',
          positioningStatement: 'Leading provider',
        };

        dynamoDocumentMock.on(UpdateCommand).resolves({});
        sqsMock.on(SendMessageCommand).resolves({});

        await updateSettingsUseCase(settings);

        expect(sqsMock.calls()).toHaveLength(1);
      });

    });
  });

  describe('Adapters', () => {
    describe('Primary Adapters', () => {

      describe('getUserDataAdapter', () => {
        it('should get user data successfully', async () => {
            const mockUserId = 'mockUserId123';
    (       authMiddleware as jest.Mock).mockReturnValue({ sub: mockUserId });
          const mockEvent: Partial<APIGatewayProxyEventV2> = {
            headers: {
                authorization: 'Bearer mockToken',
            },
          };

          const mockUser: User = {
            userId: 'user123',
            paymentStatus: PaymentStatus.paid,
            onboardingStatus: OnboardingStatus.complete,
          };

          dynamoDocumentMock.on(GetCommand).resolves({ Item: mockUser });

          const result = await getUserDataAdapter(mockEvent as APIGatewayProxyEventV2);
          const parsedResult = JSON.parse(JSON.stringify(result));
          expect(parsedResult.statusCode).toBe(200);
       
        });

        // Add more tests for error cases
      });

      describe('updateMessageSettingsPublisher', () => {
        it('should publish message settings update successfully', async () => {
            const mockUserId = 'mockUserId123';
            (authMiddleware as jest.Mock).mockReturnValue({ sub: mockUserId });
          
            const mockEvent: Partial<APIGatewayProxyEventV2> = {
            headers: {
                authorization: 'Bearer mockToken',
            },
            body: JSON.stringify({
              brandStyleTone: 'Professional',
              coreMessaging: 'Innovative solutions',
              visionStatement: 'Transform industries',
              positioningStatement: 'Leading provider',
            }),
          };

          dynamoDocumentMock.on(UpdateCommand).resolves({});
          sqsMock.on(SendMessageCommand).resolves({});

          const result = await updateSettingsPublisher(mockEvent as APIGatewayProxyEventV2);
          const parsedResult = JSON.parse(JSON.stringify(result));
          expect(parsedResult.statusCode).toBe(200);
        });

        
      });

      describe('updateMessageSettingsSubscriber', () => {
        it('should process message settings update from SQS successfully', async () => {
          const mockEvent: SQSEvent = {
            Records: [
              {
                body: JSON.stringify({
                  userId: 'user123',
                  brandStyleTone: 'Professional',
                  coreMessaging: 'Innovative solutions',
                  visionStatement: 'Transform industries',
                  positioningStatement: 'Leading provider',
                }),
                messageId: 'mock-message-id',
                receiptHandle: 'mock-receipt-handle',
                attributes: {
                  ApproximateReceiveCount: '1',
                  SentTimestamp: '1234567890',
                  SenderId: 'AIDAIT2UOQQY3AUEKVGXU',
                  ApproximateFirstReceiveTimestamp: '1234567890',
                },
                messageAttributes: {},
                md5OfBody: 'mock-md5',
                eventSource: 'aws:sqs',
                eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:MyQueue',
                awsRegion: 'us-east-1',
              },
            ],
          };

          dynamoDocumentMock.on(UpdateCommand).resolves({});

          await updateSettingsSubscriber(mockEvent);

          expect(sqsMock.calls()).toHaveLength(1);
        });

        // Add more tests for error cases
      });
    });

    describe('Secondary Adapters', () => {
      describe('user-management', () => {
        it('should create a user successfully', async () => {
          const newUser: NewUser = {
            userId: 'user123',
            paymentStatus: PaymentStatus.notPaid,
            onboardingStatus: OnboardingStatus.notStarted,
          };

          dynamoDocumentMock.on(PutCommand).resolves({});

          await createUser(newUser);

          expect(dynamoDocumentMock.calls()).toHaveLength(1);
        });

        it('should get user data successfully', async () => {
          const mockUser: User = {
            userId: 'user123',
            paymentStatus: PaymentStatus.paid,
            onboardingStatus: OnboardingStatus.complete,
          };

          dynamoDocumentMock.on(GetCommand).resolves({ Item: mockUser });

          const result = await getUserData('user123');

          expect(result).toEqual(mockUser);
          expect(dynamoDocumentMock.calls()).toHaveLength(1);
        });

        it('should update user preferences successfully', async () => {
          const settings: UserSettings = {
            userId: 'user123',
            brandStyleTone: 'Professional',
            coreMessaging: 'Innovative solutions',
            visionStatement: 'Transform industries',
            positioningStatement: 'Leading provider',
          };

          dynamoDocumentMock.on(UpdateCommand).resolves({});

          await updateUserSettings(settings);

          expect(dynamoDocumentMock.calls()).toHaveLength(1);
        });

        // Add more tests for error cases
      });

      describe('event-publisher', () => {
        it('should publish an event successfully', async () => {
            const job: UserSettingsJob = {
            jobId: 'job123',
            userId: 'user123',
            brandStyleTone: 'Professional',
            coreMessaging: 'Innovative solutions',
            visionStatement: 'Transform industries',
            positioningStatement: 'Leading provider',
            queue: Queue.user,
            status: Status.Pending,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          sqsMock.on(SendMessageCommand).resolves({});

          await publishEvent(job);

          expect(sqsMock.calls()).toHaveLength(1);
        });

        // Add more tests for error cases
      });
    });
  });
});