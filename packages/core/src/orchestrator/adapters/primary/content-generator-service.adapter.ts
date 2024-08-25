import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { generateContentUseCase  } from '@orchestrator/usecases/publish-generate-content-job.usecase';
import { GenerateContentInputSchema } from '@orchestrator/metadata/content-generator-service.schema';
import { authMiddleware } from '@utils/jwt';

export const aiGeneratorHandler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const decodedToken = authMiddleware(event);

    if (!event.body) {
      throw new Error("Missing request body");
    }
    
    const body = JSON.parse(event.body);
    
    const validatedInput = GenerateContentInputSchema.parse({ ...body, userId: decodedToken.sub });
    console.log("Starting AI Action:", validatedInput);
    const result = await generateContentUseCase(validatedInput);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in AI action:', error);
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