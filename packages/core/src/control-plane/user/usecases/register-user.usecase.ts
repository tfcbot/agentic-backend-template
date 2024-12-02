import { NewUser } from '@control-plane/user/metadata/user.schema';
import { userAdapter } from '../adapters/secondary/user-management.adapter';

export const registerUserUseCase = async (newUserData: NewUser): Promise<{ message: string }> => {
  try {
    await userAdapter.registerUser(newUserData);
    return {
      message: 'User created successfully'
    };
  } catch (error) {
    console.error('Failed to create user:', error);
    return {
      message: 'User creation failed'
    };
  }
};