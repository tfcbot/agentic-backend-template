import { 
    CreditCheckCommand, 
    UpdateRemainingCreditsCommand, 
    UpdateRemainingCreditsCommandOutput 
  } from "@utils/metadata/credit.schema";
  import { 
    ApiKeyRepository, 
    ApiKeyService, 
    IApiKeyService 
  } from "@utils/vendors/api-key-vendor";
  import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
  import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
  import { ICreditManagerTool } from "@utils/metadata/tools.schema";
  
  
  
  class CreditManagerTool implements ICreditManagerTool {
    private apiKeyService: IApiKeyService;
    constructor() {
      const dbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
      const apiKeyRepository = new ApiKeyRepository(dbClient);
      this.apiKeyService = new ApiKeyService(apiKeyRepository);
    }
  
    async executeServiceMethod<T extends keyof IApiKeyService>(
      methodName: T,
      params: Parameters<IApiKeyService[T]>[0]
    ): Promise<ReturnType<IApiKeyService[T]>> {
        try {
            const result = await this.apiKeyService[methodName](params as any);
            return result as ReturnType<IApiKeyService[T]>;
        } catch (error) {
            console.error(`Error in ${methodName}:`, error);
            throw new Error(`Failed to ${methodName.toString()}`);
        }
    }
  
    async getCurrentCredits(apiKey: string): Promise<number> {
      const result = await this.executeServiceMethod('getApiKey', { keyId: apiKey });
      return result.remaining || 0;
    }
  
    async checkCredits(params: CreditCheckCommand): Promise<boolean> {
     const currentCredits = await this.getCurrentCredits(params.keyId);
     return currentCredits >= params.amount;
    }
  
    async updateRemainingCredits(params: UpdateRemainingCreditsCommand): Promise<UpdateRemainingCreditsCommandOutput> {
      const result = await this.executeServiceMethod('updateRemainingCredits', params);
      return result;
    }
  }
  
  export const creditManagerTool = new CreditManagerTool();
  