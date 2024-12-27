import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// Initialize DynamoDB client
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const TABLE_NAME = process.env.WEBSITE_REVIEWS_TABLE || "WebsiteReviews";

export const websiteReviewRepository = {
  saveReview: async (review: string): Promise<void> => {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: Date.now().toString(),
        review,
        createdAt: new Date().toISOString()
      }
    };

    try {
      await dynamoDbClient.send(new PutCommand(params));
    } catch (error) {
      console.error("Error saving review:", error);
      throw new Error("Failed to save review");
    }
  },
};
