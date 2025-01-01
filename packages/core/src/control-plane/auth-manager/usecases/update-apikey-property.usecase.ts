import { AuthManagerAdapter } from "@control-plane/auth-manager/adapters/secondary/auth-manager.adapter";
import { UpdateTokenKeyIdCommand } from "@control-plane/auth-manager/metadata/auth-manager.schema";

export const updateTokenKeyIdUseCase = async (input: UpdateTokenKeyIdCommand): Promise<{ message: string }> => {
  try {
    const authManagerAdapter = new AuthManagerAdapter();

    await authManagerAdapter.updateUserProperties(input);
    return {
      message: 'User properties updated successfully',
    };
  } catch (error) {
    console.error('Error in updateTokenKeyIdUseCase:', error);
    throw new Error('Failed to update user properties');
  }
};
