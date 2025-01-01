import { CreateApiKeyCommand, SaveApiKeyCommand, CreateApiKeyCommandInput } from '@control-plane/user/metadata/api-key.schema';
import { ApiKeyAdapter } from '@control-plane/user/adapters/secondary/api-key.adapter';

export const createApiKeyUseCase = async (createApiKeyCommand: CreateApiKeyCommand): Promise<{ message: string, keyId: string }> => {
  try {
    const apiKeyAdapter = new ApiKeyAdapter();
    const input: CreateApiKeyCommandInput = {
      userId: createApiKeyCommand.userId,
      remaining: 150,
      refill: {
        interval: "monthly", 
        amount: 150,
      },
    };
    const createdApiKey = await apiKeyAdapter.createApiKey(input);
    
    const saveApiKeyInput : SaveApiKeyCommand = {
      apiKey: createdApiKey.key,
      keyId: createdApiKey.keyId,
      userId: createApiKeyCommand.userId,
    }
    await apiKeyAdapter.saveApiKey(saveApiKeyInput);
    return {
     message: 'API key created successfully',
     keyId: createdApiKey.keyId,
    }
  } catch (error) {
    console.error('Error in createApiKeyUseCase:', error);
    throw new Error('Failed to create API key');
  }
};
