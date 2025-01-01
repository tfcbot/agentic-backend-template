import { DynamoDBStreamEvent, Context } from 'aws-lambda';
import { createApiKeyUseCase } from '@control-plane/user/usecases/create-api-key.usecase';
import { CreateApiKeyCommand } from '@control-plane/user/metadata/api-key.schema';


export const createApiKeyAdapter = async (event: DynamoDBStreamEvent, context: Context) => {
  console.log("---Create API key handler---");
  for (const record of event.Records) {
    if (record.eventName !== 'INSERT' && record.eventName !== 'MODIFY') continue;
    
    const newUser = record.dynamodb?.NewImage;
    if (!newUser?.userId?.S) {
      console.error('User ID is undefined');
      throw new Error('User ID is undefined');
    }

    const userId = newUser.userId.S;
    
    // Check waitlist status
    if (newUser.onboardingComplete?.BOOL && newUser.waitlist?.BOOL) {
      console.info(`User ${userId} is on waitlist, skipping API key creation`);
      return;
    }

    // Check payment status
    const paymentStatus = newUser.paymentStatus?.S;
    if (!paymentStatus || paymentStatus !== 'Complete') {
      console.info(`User ${userId} is ${paymentStatus ? 'not paid' : 'missing payment status'}, skipping API key creation`);
      return;
    }

    try {
      const input: CreateApiKeyCommand = {
        userId: userId,
      }
      const message = await createApiKeyUseCase(input);
      console.info(message);
    } catch (error) {
      console.error(`Failed to create API key for user ${userId}:`, error);
    }
  }
};