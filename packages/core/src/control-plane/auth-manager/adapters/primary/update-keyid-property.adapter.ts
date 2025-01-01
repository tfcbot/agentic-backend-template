import { DynamoDBStreamEvent, Context } from 'aws-lambda';

import { UpdateTokenKeyIdCommand } from '@control-plane/auth-manager/metadata/auth-manager.schema';
import { updateTokenKeyIdUseCase } from '@control-plane/auth-manager/usecases/update-apikey-property.usecase';

export const updateTokenKeyIdAdapter = async (event: DynamoDBStreamEvent, context: Context) => {


  for (const record of event.Records) {
    if (record.eventName === 'INSERT') {
      const newApiKey = record.dynamodb?.NewImage;
      if (newApiKey) {
        const keyId = newApiKey.keyId.S;
        const userId = newApiKey.userId.S;
        if (!userId) {
          console.error('User ID is undefined');
          throw new Error('User ID is undefined');
        }
        if (!keyId) {
          console.error('API key is undefined');
          throw new Error('API key is undefined');
        }

        try {
         //TODO: update user properties
         const input: UpdateTokenKeyIdCommand = {
          userId: userId,
          params: {
            publicMetadata: {
              keyId: keyId
            },
          },
        };
        const message = await updateTokenKeyIdUseCase(input);
          console.info('User details:', message);
        } catch (error) {
          console.error(`Failed to retrieve user details for API key ${keyId}:`, error);
        }
      }
    }
  }
};
