import { z } from 'zod';

export const UpdateRemainingCreditsCommandSchema = z.object({
  keyId: z.string(),
  operationType: z.enum(['increment', 'decrement']),
  amount: z.number(),
});

export const UpdateRemainingCreditsCommandOutputSchema = z.object({
  remaining: z.number().nullable(),
});

export const CreditCheckCommandSchema = z.object({
  keyId: z.string(),
  amount: z.number(),
});

export type UpdateRemainingCreditsCommand = z.infer<typeof UpdateRemainingCreditsCommandSchema>;
export type UpdateRemainingCreditsCommandOutput = z.infer<typeof UpdateRemainingCreditsCommandOutputSchema>;
export type CreditCheckCommand = z.infer<typeof CreditCheckCommandSchema>;
