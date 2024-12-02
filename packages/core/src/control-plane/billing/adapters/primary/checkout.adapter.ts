import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'; 
import { createCheckoutSessionUseCase } from "@control-plane/billing/usecases/checkout.usecase"
import { CheckoutSessionInput, CheckoutSessionInputSchema} from "@control-plane/billing/metadata/billing.schema";
import { SaaSIdentityVendingMachine } from "@utils/tools/saas-identity"
import { ValidUser } from '@utils/metadata/saas-identity.schema';



export const checkoutAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const body = JSON.parse(event.body);
    const svm = new SaaSIdentityVendingMachine();
    const validUser: ValidUser = await svm.getValidUser(event);  
    const params: CheckoutSessionInput = CheckoutSessionInputSchema.parse({ ...body, ...validUser });
    const session = await createCheckoutSessionUseCase(params);  

    return {
      statusCode: 200,
      body: JSON.stringify(session),
    };
  } catch (error) {
    console.error("Error processing checkout:", error);
    if (error instanceof Error) {
      if ( error.message === 'No token provided' || error.message === 'Invalid token') {
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
