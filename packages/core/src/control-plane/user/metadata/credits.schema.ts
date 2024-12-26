import { z } from 'zod';

export const GetRemainingCreditsInputSchema = z.object({
  keyId: z.string(),
});

export const GetRemainingCreditsOutputSchema = z.object({
  credits: z.number().int().nonnegative(),
});

export type GetRemainingCreditsInput = z.infer<typeof GetRemainingCreditsInputSchema>;
export type GetRemainingCreditsOutput = z.infer<typeof GetRemainingCreditsOutputSchema>;
