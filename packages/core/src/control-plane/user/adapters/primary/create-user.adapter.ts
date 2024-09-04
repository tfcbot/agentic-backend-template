import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createUserUseCase } from '@control-plane/user/usecases/create-user.usecase';
import { Webhook } from "svix";
import { UserDetailsSchema } from '@control-plane/user/metadata/user.schema';
import { NewUser, OnboardingStatus, PaymentStatus } from '@control-plane/user/metadata/user.schema';

export const createUserAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
      throw new Error('WEBHOOK_SECRET not set');
    }

    if (!event.body) {
      throw new Error("Missing request body");
    }

    const svix_id = event.headers["svix-id"];
    const svix_timestamp = event.headers["svix-timestamp"];
    const svix_signature = event.headers["svix-signature"];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Error occurred -- no svix headers' }),
      };
    }

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: any ;

    try {
      evt = wh.verify(event.body, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      });
    } catch (err) {
      console.error('Error verifying webhook:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Error verifying webhook' }),
      };
    }

    if (evt.type === 'user.created') {

      const parsedUserData = UserDetailsSchema.parse(evt);
      const newUser: NewUser = {
        userId: parsedUserData.data.id, 
        paymentStatus: PaymentStatus.notPaid,
        onboardingStatus: OnboardingStatus.inProgress
      }
      await createUserUseCase(newUser);

      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User created successfully' }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Unsupported event type' }),
      };
    }
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};