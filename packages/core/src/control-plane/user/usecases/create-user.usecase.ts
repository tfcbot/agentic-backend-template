import { createUser } from '@control-plane/user/adapters/secondary/user-management.adapter';
import { NewUser } from '@control-plane/user/metadata/user.schema';

export const createUserUseCase = async (newUserData: NewUser) => {
  try {

    await createUser(newUserData);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw new Error('User creation failed');
  }
};