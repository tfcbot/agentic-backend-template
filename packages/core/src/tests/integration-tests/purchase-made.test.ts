import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResultV2, APIGatewayProxyEventV2 } from 'aws-lambda';
import { authMiddleware } from '@utils/jwt';
import { checkoutAdapter } from '@control-plane/billing/adapters/primary/checkout.adapter';
import { billingWebhookAdapter } from '@control-plane/billing/adapters/primary/billing-webhook.adapter';
import { OnboardingStatus, PaymentStatus } from '@control-plane/billing/metadata/billing.schema';


const ddbMock = mockClient(DynamoDBDocumentClient);


jest.mock('@utils/jwt', () => ({
  authMiddleware: jest.fn().mockReturnValue({ sub: 'mockUserId' }),
}));


jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: jest.fn().mockResolvedValue({
          id: 'mock-session-id',
          url: 'https://mock-checkout-url.com',
        }),
      },
    },
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
            userId: 'mockUserId123',
          },
          mode: 'payment',
          payment_intent: 'pi_3OIfSJ2eZvKYlo2C1J39JnQx',
          payment_status: 'paid',
          status: 'complete',
          subscription: 'sub_1234567890', // Added this line
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

jest.mock('sst', () => ({
  Resource: {
    Users: { tableName: 'MockUserTable' },
  }
}));

describe('Purchase Made Integration', () => {

  beforeEach(() => {
    ddbMock.reset();
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'mock-stripe-secret-key';
    process.env.STRIPE_WEBHOOK_SECRET = 'mock-stripe-webhook-secret';
    process.env.PRICE_ID = 'mock-price-id';
    process.env.REDIRECT_SUCCESS_URL = 'https://mock-success-url.com';
    process.env.REDIRECT_FAILURE_URL = 'https://mock-failure-url.com';

    // Update this line to mock the DynamoDBDocumentClient response
    ddbMock.on(UpdateCommand).resolves({});
  });

  it('should process a purchase through checkout and webhook', async () => {
    const mockUserId = 'mockUserId123';
    (authMiddleware as jest.Mock).mockReturnValue({ sub: mockUserId });

    // Mock the checkout input
    const mockCheckoutEvent: Partial<APIGatewayProxyEventV2> = {
      headers: {
        authorization: 'Bearer mockToken',
      },
    };

    // Checkout result
    const checkoutResult: APIGatewayProxyResultV2 = await checkoutAdapter(mockCheckoutEvent as APIGatewayProxyEventV2);
    const parsedCheckoutResult = JSON.parse(JSON.stringify(checkoutResult));
    
    expect(parsedCheckoutResult.statusCode).toBe(200);
    expect(JSON.parse(parsedCheckoutResult.body)).toEqual({ url: 'https://mock-checkout-url.com' });
    expect(authMiddleware).toHaveBeenCalledWith(mockCheckoutEvent);

    // Mock the webhook event

    // Mock DynamoDB update
    ddbMock.on(UpdateCommand).resolves({});

    const mockWebhookEvent: Partial<APIGatewayProxyEventV2> = {
        headers: {
          "stripe-signature": 'Bearer mockToken',
        },
      };
    // Process the webhook
    const webhookResult = await billingWebhookAdapter(mockWebhookEvent);
    const parsedWebhookResult = JSON.parse(JSON.stringify(webhookResult));

    expect(parsedWebhookResult.statusCode).toBe(200);
    expect(JSON.parse(parsedWebhookResult.body)).toEqual({ message: "Billing event processed successfully" });

    // Verify DynamoDB update call
    const dynamoCall = ddbMock.call(0);
    expect(dynamoCall.args[0].input).toMatchObject({
      TableName: expect.any(String),
      Key: { userId: mockUserId },
      UpdateExpression: 'SET paymentStatus = :paymentStatus, onboardingStatus = :onboardingStatus',
      ExpressionAttributeValues: {
        ':paymentStatus': PaymentStatus.paid,
        ':onboardingStatus': OnboardingStatus.complete
      },
    });
  });
});