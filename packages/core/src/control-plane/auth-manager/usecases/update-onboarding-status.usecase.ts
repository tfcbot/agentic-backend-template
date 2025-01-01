import { AuthManagerAdapter } from "@control-plane/auth-manager/adapters/secondary/auth-manager.adapter";
import { UpdateOnboardingStatusCommand } from "@control-plane/auth-manager/metadata/auth-manager.schema";

export const updateOnboardingStatusUseCase = async (input: UpdateOnboardingStatusCommand): Promise<{ message: string }> => {
  console.info("Updating onboarding status for user");
  try {
    const authManagerAdapter = new AuthManagerAdapter();

    await authManagerAdapter.updateUserProperties(input);
    return {
      message: 'User onboarding status updated successfully',
    };
  } catch (error) {
    console.error('Error in updateOnboardingStatusUseCase:', error);
    throw new Error('Failed to update user onboarding status');
  }
};
