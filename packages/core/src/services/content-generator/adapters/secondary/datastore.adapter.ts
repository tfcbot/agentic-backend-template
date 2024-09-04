import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Content } from "@services/content-generator/metadata/content.schema";

// @ts-ignore
import { Resource } from "sst";

const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const getUserContent = async (userId: string): Promise<Content[]> => {
    console.log('GetContentForUser called')
    try {
        const params = {
            // @ts-ignore
            TableName: Resource.Table.tableName,
            IndexName: "UserIndex",
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId,
            },
        };

        const command = new QueryCommand(params);
        const result = await dynamoClient.send(command);
        console.log('Retrieved Items', result.Items)
        if (!result.Items) {
            return [];
        }

        return result.Items as Content[];
    } catch (error) {
        console.error("Error fetching content for user:", error);
        throw new Error("Failed to fetch user content");
    }
}

export const saveContent = async (content: Content): Promise<void> => {
    try {
        await dynamoClient.send(new PutCommand({
            // @ts-ignore
            TableName: Resource.Table.tableName,
            Item: content
        }));
    } catch (error) {
        console.error("Error saving content:", error);
        throw new Error("Failed to save content");
    }
}