import { z } from 'zod';


export const UpdatePropertyCommandInputSchema = z.object({
  userId: z.string(),
  params: z.object({
    publicMetadata: z.record(z.string(), z.any()),
  }),
});

export const UpdateTokenKeyIdCommand = z.object({
  userId: z.string(),
  params: z.object({
    publicMetadata: z.object({
      keyId: z.string()
    }),
  }),
});

export const UpdateOnboardingStatusCommand = z.object({
  userId: z.string(),
  params: z.object({
    publicMetadata: z.object({
      onboardingComplete: z.boolean(),
      waitlist: z.boolean(),
    }),
  }),
});

export type UpdateTokenKeyIdCommand = z.infer<typeof UpdateTokenKeyIdCommand>;
export type UpdateOnboardingStatusCommand = z.infer<typeof UpdateOnboardingStatusCommand>;
export type UpdatePropertyCommandInput = z.infer<typeof UpdatePropertyCommandInputSchema>;
