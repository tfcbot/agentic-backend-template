import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { ContentDTO, GetContentInput, GetContentOutput } from "@agent-plane/content-generator/metadata/content-generator.schema";

// @ts-ignore
import { Resource } from "sst";

export interface IContentRepository {
  saveContent(content: ContentDTO): Promise<void>;
  getContent(input: GetContentInput): Promise<GetContentOutput[]>;
}

class ContentRepository implements IContentRepository {
  constructor(private dbClient: DynamoDBDocumentClient) {}

  async saveContent(content: ContentDTO): Promise<void> {
    console.info("Saving content to database via ContentRepository");
    try {
      const params = {
        TableName: Resource.ContentTable.tableName,
        Item: content
      };
      await this.dbClient.send(new PutCommand(params));
    } catch (error) {
      console.error("Error saving content:", error);
      throw new Error("Failed to save content");
    }
  }

  async getContent(input: GetContentInput): Promise<GetContentOutput[]> {
    console.info("Getting content data from database via ContentRepository");
    try {
      const params = {
        TableName: Resource.ContentTable.tableName,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': input.userId
        }
      };
      const result = await this.dbClient.send(new QueryCommand(params));
      if (!result.Items) {
        return [];
      }
      console.info("Content data retrieved");
      
      return result.Items.map(item => ({
        id: item.contentId,
        content: item.content
      }));
    } catch (error) {
      console.error("Error getting content data:", error);
      throw new Error("Failed to get content data");
    }
  }
}

export const createContentRepository = (dbClient: DynamoDBDocumentClient): IContentRepository => new ContentRepository(dbClient);
