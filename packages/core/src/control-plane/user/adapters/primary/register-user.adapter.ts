import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { UserDetailsSchema } from '@control-plane/user/metadata/user.schema';
import { NewUser} from '@control-plane/user/metadata/user.schema';
import { ClerkService } from '@utils/vendors/jwt-vendor';
import { registerUserUseCase } from '@control-plane/user/usecases/register-user.usecase';

export const registerUserAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const clerkService = new ClerkService();
    console.info("Received event from clerk");
    // Validate the webhook event
    const evt = await clerkService.validateWebhookEvent(event);
    console.info("Validated event");
    switch (evt?.type) {
      case 'user.created':
        const parsedUserData = UserDetailsSchema.parse(evt.data);
        console.info("Parsed user data from clerk");
        const newUser: NewUser = {
          userId: parsedUserData.id,
        }
        await registerUserUseCase(newUser);
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Error processing event' }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};