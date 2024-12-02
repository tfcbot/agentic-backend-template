import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetUserContentInputSchema } from 'src/orchestrator/metadata/content-generator-service.schema'
import { getUserContentUseCase } from '@orchestrator/usecases/retrieve-user-content.usecase';

import { authMiddleware } from '../../../../../utils/src/vendors/jwt-ventdor';

export const getUserContentAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  
    try {
    const decodedToken = authMiddleware(event);

    const input = GetUserContentInputSchema.parse({ userId: decodedToken.sub });
    const userInfo = await getUserContentUseCase(input);
    console.log('Retrieved from Usecase', userInfo)
    return {
      statusCode: 200,
      body: JSON.stringify(userInfo),
    };
  } catch (error) {
    console.error('Error fetching user info:', error);
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