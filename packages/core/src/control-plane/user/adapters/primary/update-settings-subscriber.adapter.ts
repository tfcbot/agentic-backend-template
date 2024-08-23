import { SQSEvent } from 'aws-lambda';
import { updateSettingsUseCase } from '@control-plane/user/usecases/update-settings.usecase';
import { UserSettingsSchema } from '@control-plane/user/metadata/user.schema';

export const updateSettingsSubscriber = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const body = JSON.parse(record.body);

      UserSettingsSchema.parse(body);
      await updateSettingsUseCase(body);
      console.log('Settings updated successfully for :', record.messageId);
    }
  } catch (error) {
    console.log(error)
    console.error('Error processing SQS s:', error);
    throw error; // Rethrowing the error will cause the Lambda to retry processing the 
  }
};
