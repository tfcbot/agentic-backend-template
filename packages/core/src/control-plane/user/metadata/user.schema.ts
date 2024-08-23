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

    // Types
    UserDetails,
    NewUser,
    User,
    UserSettings,
    UserSettingsJob,
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
    data: z.object({
        backup_code_enabled: z.boolean(),
        banned: z.boolean(),
        create_organization_enabled: z.boolean(),
        created_at: z.number(),
        delete_self_enabled: z.boolean(),
        email_addresses: z.array(z.object({
            email_address: z.string(),
            id: z.string(),
            linked_to: z.array(z.unknown()),
            object: z.literal('email_address'),
            verification: z.object({
                status: z.string(),
                strategy: z.string()
            })
        })),
        external_accounts: z.array(z.unknown()),
        external_id: z.string().nullable(),
        first_name: z.string().nullable(),
        has_image: z.boolean(),
        id: z.string(),
        image_url: z.string(),
        last_active_at: z.number(),
        last_name: z.string().nullable(),
        last_sign_in_at: z.number().nullable(),
        locked: z.boolean(),
        lockout_expires_in_seconds: z.number().nullable(),
        mfa_disabled_at: z.number().nullable(),
        mfa_enabled_at: z.number().nullable(),
        object: z.literal('user'),
        passkeys: z.array(z.unknown()),
        password_enabled: z.boolean(),
        phone_numbers: z.array(z.unknown()),
        primary_email_address_id: z.string(),
        primary_phone_number_id: z.string().nullable(),
        primary_web3_wallet_id: z.string().nullable(),
        private_metadata: z.record(z.unknown()),
        profile_image_url: z.string(),
        public_metadata: z.record(z.unknown()),
        saml_accounts: z.array(z.unknown()),
        totp_enabled: z.boolean(),
        two_factor_enabled: z.boolean(),
        unsafe_metadata: z.record(z.unknown()),
        updated_at: z.number(),
        username: z.string().nullable(),
        verification_attempts_remaining: z.number(),
        web3_wallets: z.array(z.unknown())
    }),
    object: z.literal('event'),
    type: z.literal('user.created')
});

const NewUserSchema = z.object({
    userId: z.string(),
    paymentStatus: z.nativeEnum(PaymentStatus),
    onboardingStatus: z.nativeEnum(OnboardingStatus)
});

const UserSchema = z.object({
    userId: z.string(),
    paymentStatus: z.nativeEnum(PaymentStatus),
    onboardingStatus: z.nativeEnum(OnboardingStatus)
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

// Types
type UserDetails = z.infer<typeof UserDetailsSchema>;
type NewUser = z.infer<typeof NewUserSchema>;
type User = z.infer<typeof UserSchema>;
type UserSettings = z.infer<typeof UserSettingsSchema>;
type UserSettingsJob = z.infer<typeof UserSettingsJobSchema>;
