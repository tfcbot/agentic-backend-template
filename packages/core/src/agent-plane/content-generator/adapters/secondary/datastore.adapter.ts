import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createContentRepository } from '@agent-plane/content-generator/adapters/secondary/content.respository';
// Set up DynamoDB client
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

// Set up repositories
export const contentRepository = createContentRepository(dynamoDbClient);
