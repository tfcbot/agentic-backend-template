import { IApiKeyManager, apiKeyManager } from "@utils/tools/api-key-manager";
import { CreateApiKeyCommandInput, CreateApiKeyCommandOutput, DeleteApiKeyCommandInput, SaveApiKeyCommand } from "@utils/metadata/apikey.schema";
import { UpdateRemainingCreditsCommand, UpdateRemainingCreditsCommandOutput } from "@utils/metadata/credit.schema";
import { GetApiKeyCommandOutput } from "@utils/metadata/apikey.schema";
import { Message } from "@utils/metadata/message.schema";
import { ApiKey } from "@control-plane/billing/metadata/api-key.schema";

export interface IApiKeyAdapter {
    createApiKey(params: CreateApiKeyCommandInput): Promise<CreateApiKeyCommandOutput>;
    saveApiKey(params: SaveApiKeyCommand): Promise<Message>;
    updateRemainingCredits(params: UpdateRemainingCreditsCommand): Promise<UpdateRemainingCreditsCommandOutput>;
    getApiKeyById(keyId: string): Promise<GetApiKeyCommandOutput>;
    deleteApiKey(params: DeleteApiKeyCommandInput): Promise<Message>;
}

export class ApiKeyAdapter implements IApiKeyAdapter {
    private apiKeyManager: IApiKeyManager;

    constructor() {
        this.apiKeyManager = apiKeyManager;
    }

    async getApiKeyById(keyId: string): Promise<GetApiKeyCommandOutput> {
        return this.apiKeyManager.getApiKeyById(keyId);
    }

    async createApiKey(params: CreateApiKeyCommandInput): Promise<CreateApiKeyCommandOutput> {
        return this.apiKeyManager.createApiKey(params);
    }

    async saveApiKey(params: SaveApiKeyCommand): Promise<Message> {
        return this.apiKeyManager.saveApiKey(params);
    }

    async updateRemainingCredits(params: UpdateRemainingCreditsCommand): Promise<UpdateRemainingCreditsCommandOutput> {
        return this.apiKeyManager.updateRemainingCredits(params);
    }

    async getRemainingCredits(keyId: string): Promise<number> {
        const apiKey = await this.apiKeyManager.getApiKeyById(keyId);
        return apiKey.remaining || 0;
    }

    async deleteApiKey(params: DeleteApiKeyCommandInput): Promise<Message> {
        return this.apiKeyManager.deleteApiKey(params);
    }

    async updateApiKey(keyId: string, updateData: Partial<ApiKey>): Promise<ApiKey> {
       throw new Error('Method not implemented.');
    }
}

export const apiKeyAdapter = new ApiKeyAdapter();
        