import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { billingWebhookAdapter } from '@control-plane/billing/adapters/primary/billing-webhook.adapter';
import { PaymentStatus, OnboardingStatus } from '@control-plane/billing/metadata/billing.schema';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn().mockResolvedValue({
        id: 'cs_test_123',
        object: 'checkout.session',
        type: 'checkout.session.completed',
        data: {
          object: {
            id: 'cs_test_123',
            object: 'checkout.session',
            amount_subtotal: 18900,
            amount_total: 18900,
            automatic_tax: {
              enabled: false,
              liability: null,
              status: null,
            },
            created: 1701470707,
            currency: 'usd',
            customer: 'cus_9s6XKzkNRiz8i3',
            customer_details: {
              address: {
                city: null,
                country: 'US',
                line1: null,
                line2: null,
                postal_code: '12345',
                state: null,
              },
              email: 'email2@gmail.com',
              name: 'example name2',
              phone: '2000000',
              tax_exempt: 'none',
              tax_ids: [],
            },
            expires_at: 1701557107,
            invoice: 'in_1OIfSJ2eZvKYlo2Cqkek1IHA',
            livemode: false,
            metadata: {
              userId: 'user123',
            },
            mode: 'payment',
            payment_intent: 'pi_3OIfSJ2eZvKYlo2C1J39JnQx',
            payment_status: 'paid',
            status: 'complete',
            subscription: 'sub_1234567890',
            total_details: {
              amount_discount: 0,
              amount_shipping: 0,
              amount_tax: 0,
            },
          },
        },
      }),
    },
  }));
});

jest.mock('@control-plane/billing/usecases/update-billing-status.usecase');

// Mock SST Resource
jest.mock('sst', () => ({
  Resource: {
    Users: {
      tableName: 'MockedUsersTable',
    },
  },
}));

const dynamoMock = mockClient(DynamoDBClient);
const dynamoDocumentMock = mockClient(DynamoDBDocumentClient);
const sqsMock = mockClient(SQSClient);

describe('Billing Webhook Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    dynamoMock.reset();
    dynamoDocumentMock.reset();
    sqsMock.reset();
    process.env.STRIPE_WEBHOOK_SECRET = 'mock-stripe-webhook-secret';
  });

  describe('billingWebhookAdapter', () => {
    it('should process a valid checkout.session.completed event', async () => {
      const mockEvent = {
        body: JSON.stringify({
          type: 'checkout.session.completed',
          data: {
            object: {
              metadata: {
                userId: 'user123',
              },
            },
          },
        }),
        headers: {
          'stripe-signature': 'valid_signature',
        },
      };

      const updateBillingStatusUsecaseMock = require('@control-plane/billing/usecases/update-billing-status.usecase').updateBillingStatusUsecase;
      updateBillingStatusUsecaseMock.mockResolvedValue({ statusCode: 200, body: 'OK' });

      const result = await billingWebhookAdapter(mockEvent);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).message).toBe('Billing event processed successfully');
      expect(updateBillingStatusUsecaseMock).toHaveBeenCalledWith({
        userId: 'user123',
        paymentStatus: PaymentStatus.paid,
        onboardingStatus: OnboardingStatus.complete,
      });
    });
  });
});