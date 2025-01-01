import { SQSEvent } from 'aws-lambda';
import { updateUserOnboardingDetailsUseCase } from '@control-plane/user/usecases/update-onboarding-details.usecase';
import { UpdateUserOnboardingDetailsInputSchema } from '@control-plane/user/metadata/user.schema';

export const onboardingAdapter = async (event: SQSEvent): Promise<void> => {
  console.info("Onboarding message received");
  try {
    for (const record of event.Records) {
      const payload = JSON.parse(record.body);
      const messageData = JSON.parse(payload.Message);
      const validatedPayload = UpdateUserOnboardingDetailsInputSchema.parse(messageData);
      
      // Process the onboarding message
      const status = await updateUserOnboardingDetailsUseCase(validatedPayload);
      console.info("Onboarding status", status);
    }
  } catch (error) {
    console.error('Error in onboardingAdapter:', error);
    throw error;
  }
}