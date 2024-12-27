import { randomUUID } from 'crypto';
import {
  GetContentResponseBodySchema
} from '@orchestrator/metadata/content-generator.schema';

describe('Content Generation API Tests', () => {

  beforeEach(() => {
    
  });

  const headers = {
    'Authorization': `Bearer ${process.env.AccessToken}`, 
    'Content-Type': 'application/json',
  };

  test('User should be able to generate content', async () => {
    const response = await fetch(`${process.env.api}/content/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt: 'Test prompt',
        userId: process.env.TestUserId
      })
    });

    expect(response.status).toBe(200);
    
    const responseBody = await response.json();
    const validatedResponse = GetContentResponseBodySchema.parse(responseBody);
    
    expect(validatedResponse.data.content).toBeDefined();
  });

  test('User should be able to get content', async () => {
    const response = await fetch(`${process.env.api}/content`, {
      method: 'GET',
      headers,
    });

    expect(response.status).toBe(200);  

  });
});
