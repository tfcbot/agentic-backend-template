import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, GetItemCommandOutput } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Content } from '@agent-plane/content-agent/metadata/agent';
// @ts-ignore
import { Resource } from 'sst';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});



export const saveContent = async (content: Content): Promise<void> => {
  await client.send(new PutCommand({
      // @ts-ignore
      TableName: Resource.GeneratedContentTable.tableName,
      Item: content,
  }));
};