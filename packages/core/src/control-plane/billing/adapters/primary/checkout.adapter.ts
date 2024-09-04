import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'; 
import { createCheckoutSessionUseCase } from "@control-plane/billing/usecases/checkout.usecase"
import { checkoutIntentSchema } from "@control-plane/billing/metadata/billing.schema";
import { authMiddleware } from '@utils/jwt';

export const checkoutAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const decodedToken = authMiddleware(event);
    const validBody = checkoutIntentSchema.parse({ userId: decodedToken.sub });
    const session = await createCheckoutSessionUseCase(validBody.userId);  

    return {
      statusCode: 200,
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error("Error processing checkout:", error);
    if (error instanceof Error) {
      if (error.message === 'Missing CLERK_PEM_PUBLIC_KEY' || error.message === 'No token provided' || error.message === 'Invalid token') {
        return {
          statusCode: 401,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request" }),
    };
  }
}
