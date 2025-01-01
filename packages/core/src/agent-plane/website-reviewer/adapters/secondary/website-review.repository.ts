import { DynamoDBDocumentClient, PutCommand, QueryCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { WebsiteReview } from "@orchestrator/metadata/agent-plane.schema";
// @ts-ignore
import { Resource } from "sst";

export interface IWebsiteReviewRepository {
  saveReview(review: WebsiteReview): Promise<void>;
  getReviews(userId: string): Promise<WebsiteReview[]>;
}

class WebsiteReviewRepository implements IWebsiteReviewRepository {
  constructor(private dbClient: DynamoDBDocumentClient) {}

  async saveReview(review: WebsiteReview): Promise<void> {
    console.info("Saving website review to database via WebsiteReviewRepository");
    try {
      const params = {
        TableName: Resource.WebsiteReviewTable.tableName,
        Item: review
      };
      await this.dbClient.send(new PutCommand(params));
    } catch (error) {
      console.error("Error saving review:", error);
      throw new Error("Failed to save review");
    }
  }

  async getReviews(userId: string): Promise<WebsiteReview[]> {
    console.info("Getting website reviews from database via WebsiteReviewRepository");
    try {
      const params = {
        TableName: Resource.WebsiteReviewTable.tableName,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": userId
        }
      };
      const result = await this.dbClient.send(new QueryCommand(params));
      return result.Items as WebsiteReview[];
    } catch (error) {
      console.error("Error getting reviews:", error);
      throw new Error("Failed to get reviews");
    }
  }
}

export const createWebsiteReviewRepository = (dbClient: DynamoDBDocumentClient): IWebsiteReviewRepository => 
  new WebsiteReviewRepository(dbClient);
