import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { createWebsiteReviewRepository } from './website-review.repository';

// Set up DynamoDB client
const dynamoDbClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const websiteReviewRepository = createWebsiteReviewRepository(dynamoDbClient);
