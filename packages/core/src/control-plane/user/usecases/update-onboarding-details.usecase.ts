import { userAdapter } from '../adapters/secondary/user-management.adapter';
import { UpdateUserOnboardingDetailsInput } from '../metadata/user.schema';

export const updateUserOnboardingDetailsUseCase = async (input: UpdateUserOnboardingDetailsInput): Promise<{ message: string }> => {;
  await userAdapter.updateUserOnboardingDetails(input);
  return {
    message: 'Onboarding details saved successfully',
  };
}