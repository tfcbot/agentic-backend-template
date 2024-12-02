import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { updateSettingsUseCase } from '@control-plane/user/usecases/update-settings.usecase';
import { UserSettingsSchema } from '@control-plane/user/metadata/user.schema';
import { authMiddleware } from '../../../../../../utils/src/vendors/jwt-ventdor';


export const updateSettingsPublisherAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  const decodedToken = authMiddleware(event);
  
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const body = JSON.parse(event.body);
    const validatedBody = UserSettingsSchema.parse({...body, userId: decodedToken.sub});
    await updateSettingsUseCase(validatedBody);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message settings updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating message settings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
