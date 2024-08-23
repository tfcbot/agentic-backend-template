import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NewUser } from '@control-plane/user/metadata/user.schema';
import { UserSettings} from '@control-plane/user/metadata/user.schema';
import { User } from '@control-plane/user/metadata/user.schema';
import { marshall } from '@aws-sdk/util-dynamodb';
// @ts-ignore
import { Resource } from 'sst';


const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const createUser = async (user: NewUser) => {
    try {
      const command = new PutCommand({
        TableName: Resource.Users.tableName,
        Item: user,
      });
  
      await dynamoClient.send(command);
    } catch (error) {
      console.error('Error creating user in DynamoDB:', error);
      throw new Error('Failed to create user');
    }
  };



export const getUserData = async (userId: string): Promise<User | null> => {
  try {
    const command = new GetCommand({
      TableName: Resource.Users.tableName,
      Key: { userId: userId },
    });

    const result = await dynamoClient.send(command);
    if (!result.Item) {
      return null
    }

    const userData : User = {
        userId: result.Item.userId, 
        paymentStatus: result.Item.paymentStatus, 
        onboardingStatus: result.Item.onboardingStatus
    }
    console.log('Fetched User data:', userData);
    return userData
  } catch (error) {
    console.error('Error fetching user data from DynamoDB:', error);
    throw new Error('Failed to fetch user data');
  }
};

export const updateUserSettings = async (settings: UserSettings): Promise<void> => {
  try {
    const { userId, ...updateFields } = settings;
    
    const command = new UpdateCommand({
      TableName: Resource.Users.tableName,
      Key: { userId },
      UpdateExpression: `SET ${Object.keys(updateFields).map(key => `${key} = :${key}`).join(', ')}`,
      ExpressionAttributeValues: Object.fromEntries(Object.entries(updateFields).map(([k, v]) => [`:${k}`, v])),
    });

    await dynamoClient.send(command);
  } catch (error) {
    console.error('Error updating user settings in DynamoDB:', error);
    throw new Error('Failed to update user settings');
  }
};