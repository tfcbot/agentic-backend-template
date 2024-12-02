import { getUserDataUseCase } from '@control-plane/user/usecases/get-user-data.usecase';
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { authMiddleware } from '../../../../../../utils/src/vendors/jwt-ventdor';

export const getUserDataAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const decodedToken = authMiddleware(event);

    const userId = decodedToken.sub;
    const user = await getUserDataUseCase(userId);

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    if (error instanceof Error) {
      if (error.message === 'Missing CLERK_PEM_PUBLIC_KEY' || error.message === 'No token provided' || error.message === 'Invalid token') {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};