import { UserSettings, UserSettingsJob } from '@control-plane/user/metadata/user.schema';
import { publishEvent } from 'src/control-plane/user/adapters/secondary/event-publisher.adapter';
import { randomUUID } from 'crypto';
import { Queue, Status } from '@control-plane/user/metadata/job.schema';



export const updateSettingsUseCase = async (userSettings: UserSettings): Promise<void> => { 

    try {
        const job: UserSettingsJob = {
            jobId: randomUUID(), 
            userId: userSettings.userId,
            brandStyleTone: userSettings.brandStyleTone, 
            coreMessaging: userSettings.coreMessaging,
            visionStatement: userSettings.visionStatement,
            positioningStatement: userSettings.positioningStatement,
            queue: Queue.user, 
            status: Status.Pending,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        await publishEvent(job);
    } catch (error) {
        console.error('Error in updateMessageSettingsUseCase:', error);
        throw error; // Re-throw the error to be handled by the adapter
  }
};
