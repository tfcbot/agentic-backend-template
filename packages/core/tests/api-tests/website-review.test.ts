import { randomUUID } from 'crypto';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { WebsiteReviewRequestReceivedResponseBody } from '@orchestrator/metadata/http-responses.schema';

const API_URL = process.env.api || ' https://development-api.agenticstarter.com/v1/';
const TEST_USER_ID = process.env.TestUserId || 'test-user-id';
const ddbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

describe('Website Review API Tests', () => {
  const headers = {
    'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  };

  test('User should be able to request a website review', async () => {
    const testUrl = 'https://thumbagents.com';

    const response = await fetch(`${API_URL}/request-website-review`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        url: testUrl
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json() as WebsiteReviewRequestReceivedResponseBody;
    
    expect(data).toHaveProperty('reviewId');
    expect(data).toHaveProperty('url', testUrl);
    expect(data).toHaveProperty('status', 'pending');
  });

  test('User should be able to get their website reviews', async () => {
    const response = await fetch(`${API_URL}/website-reviews`, {
      method: 'GET',
      headers,
    });

    expect(response.status).toBe(200);
    const data = await response.json() as WebsiteReviewRequestReceivedResponseBody;

    expect(Array.isArray(data.reviewId)).toBe(true);
    
    if (data.reviewId.length > 0) {
      const review = data.reviewId[0];
      expect(review).toHaveProperty('reviewId');
      expect(review).toHaveProperty('url');
      expect(review).toHaveProperty('status');
    }
  });
});
