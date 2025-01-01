import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NewUser, UpdateUserOnboardingDetailsInput } from '@control-plane/user/metadata/user.schema';
import { User } from '@control-plane/user/metadata/user.schema';


// @ts-ignore
import { Resource } from 'sst';


export interface IUserAdapter {
  registerUser(user: NewUser): Promise<void>;
  getUserData(userId: string): Promise<User | null>;
  updateUserOnboardingDetails(input: UpdateUserOnboardingDetailsInput): Promise<void>;
}

export class UserAdapter implements IUserAdapter {
  private dynamoClient: DynamoDBDocumentClient;

  constructor() {
    this.dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

  }

  async registerUser(user: NewUser): Promise<void> {
    console.info("Registering user in dynamo");
    try {
      const command = new PutCommand({
        TableName: Resource.UsersTable.tableName,
        Item: user,
      });
    
      await this.dynamoClient.send(command);
    } catch (error) {
      console.error('Error creating user in DynamoDB:', error);
      throw new Error('Failed to create user');
    }
  }


  async getUserData(userId: string): Promise<User | null> {
    try {
      const command = new GetCommand({
        TableName: Resource.UsersTable.tableName,
        Key: { userId: userId }
      });

      const result = await this.dynamoClient.send(command);
      if (!result.Item) {
        return null;
      }

      const userData: User = {
        userId: result.Item.userId,
        onboardingStatus: result.Item.onboardingStatus
      };
      return userData;
    } catch (error) {
      console.error('Error fetching user data from DynamoDB:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  async updateUserOnboardingDetails(input: UpdateUserOnboardingDetailsInput): Promise<void> {
    try {
      // Remove userId from the fields to update
      const { userId, ...updateFields } = input;

      // Dynamically build update expression and attribute values
      const updateExpressionParts: string[] = [];
      const expressionAttributeValues: Record<string, any> = {};

      Object.entries(updateFields).forEach(([key, value]) => {
        updateExpressionParts.push(`${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = value;
      });

      const command = new UpdateCommand({
        TableName: Resource.UsersTable.tableName,
        Key: { userId },
        UpdateExpression: `SET ${updateExpressionParts.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      await this.dynamoClient.send(command);
    } catch (error) {
      console.error('Error updating user onboarding details in DynamoDB:', error);
      throw new Error('Failed to update user onboarding details');
    }
  }
}

// Export singleton instance
export const userAdapter: IUserAdapter = new UserAdapter();
