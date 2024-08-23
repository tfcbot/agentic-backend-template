import { getUserData } from 'src/control-plane/user/adapters/secondary/user-management.adapter';
import { User } from '@control-plane/user/metadata/user.schema';

export const getUserDataUseCase = async (userId: string): Promise<User | null> =>  {
  try {
    const userData = await getUserData(userId);
    
    return userData;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('User data retrieval failed');
  }
};