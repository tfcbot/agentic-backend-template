import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { NewUser } from '@control-plane/user/metadata/user.schema';

// @ts-ignore
import { Resource } from 'sst';


export interface IUserAdapter {
  registerUser(user: NewUser): Promise<void>;
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

}

// Export singleton instance
export const userAdapter: IUserAdapter = new UserAdapter();