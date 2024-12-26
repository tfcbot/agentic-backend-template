import { ApiKeyRepository, ApiKeyService, IApiKeyService } from "@utils/vendors/api-key-vendor";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { CreateApiKeyCommandInput, CreateApiKeyCommandOutput, DeleteApiKeyCommandInput, SaveApiKeyCommand } from "@utils/metadata/apikey.schema"
import { UpdateRemainingCreditsCommand, UpdateRemainingCreditsCommandOutput } from "@utils/metadata/credit.schema";
import { GetApiKeyCommandOutput } from "@utils/metadata/apikey.schema";
import { Message } from "@utils/metadata/message.schema";

export interface IApiKeyManager{
    createApiKey(params: CreateApiKeyCommandInput): Promise<CreateApiKeyCommandOutput>;
    saveApiKey(params: SaveApiKeyCommand): Promise<Message>;
    updateRemainingCredits(params: UpdateRemainingCreditsCommand): Promise<UpdateRemainingCreditsCommandOutput>;
    getApiKeyById(keyId: string): Promise<GetApiKeyCommandOutput>;
    deleteApiKey(params: DeleteApiKeyCommandInput): Promise<Message>;
}

export class ApiKeyManager implements IApiKeyManager {
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
    async getApiKeyById(keyId: string): Promise<GetApiKeyCommandOutput> {
        const result = await this.executeServiceMethod('getApiKey', { keyId });
        return result;
    }

    async createApiKey(params: CreateApiKeyCommandInput): Promise<CreateApiKeyCommandOutput> {
        const result = await this.executeServiceMethod('createApiKey', params);
        return result;
    }

    async saveApiKey(params: SaveApiKeyCommand): Promise<Message> {
        const result = await this.executeServiceMethod('saveApiKey', params);
        return result;
    }

    async updateRemainingCredits(params: UpdateRemainingCreditsCommand): Promise<UpdateRemainingCreditsCommandOutput> {
        const result = await this.executeServiceMethod('updateRemainingCredits', params);
        return result;
    }

    async deleteApiKey(params: DeleteApiKeyCommandInput): Promise<Message> {
        const result = await this.executeServiceMethod('deleteApiKey', params);
        return result;
    }
}

export const apiKeyManager = new ApiKeyManager();