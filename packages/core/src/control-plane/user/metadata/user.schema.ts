import { z } from 'zod';
import { Queue, Status } from '@control-plane/user/metadata/job.schema';

export {
    // Enums
    PaymentStatus,
    OnboardingStatus,

    // Schemas
    UserDetailsSchema,
    NewUserSchema,
    UserSchema,
    UserSettingsSchema,
    UserSettingsJobSchema,
    UpdateUserOnboardingDetailsInputSchema,
    // Types
    UserDetails,
    NewUser,
    User,
    UserSettings,
    UserSettingsJob,
    UpdateUserOnboardingDetailsInput,
};

// Enums
enum PaymentStatus {
    paid = 'PAID',
    notPaid = 'NOT_PAID'
}

enum OnboardingStatus {
    notStarted = 'NOT_STARTED',
    inProgress = 'IN_PROGRESS',
    complete = 'COMPLETE'
}

// Schemas
const UserDetailsSchema = z.object({
    id: z.string(),
});


const NewUserSchema = z.object({
    userId: z.string(),
});

const UserSchema = z.object({
    userId: z.string(),
    onboardingStatus: z.nativeEnum(OnboardingStatus),
});

const UserSettingsSchema = z.object({
    userId: z.string(),
    brandStyleTone: z.string(),
    coreMessaging: z.string(),
    visionStatement: z.string(),
    positioningStatement: z.string()
});

const UserSettingsJobSchema = z.object({
    jobId: z.string().uuid(),
    userId: z.string(),
    brandStyleTone: z.string(),
    coreMessaging: z.string(),
    visionStatement: z.string(),
    positioningStatement: z.string(),
    queue: z.nativeEnum(Queue),
    status: z.nativeEnum(Status),
    createdAt: z.string(),
    updatedAt: z.string()
});

const UpdateUserOnboardingDetailsInputSchema = z.object({
    userId: z.string(),
    currentRole: z.string(),
    useCase: z.string(),
    onboardingComplete: z.boolean(),
});


// Types
type UserDetails = z.infer<typeof UserDetailsSchema>;
type NewUser = z.infer<typeof NewUserSchema>;
type User = z.infer<typeof UserSchema>;
type UserSettings = z.infer<typeof UserSettingsSchema>;
type UserSettingsJob = z.infer<typeof UserSettingsJobSchema>;
type UpdateUserOnboardingDetailsInput = z.infer<typeof UpdateUserOnboardingDetailsInputSchema>;
