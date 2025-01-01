import { z } from 'zod';

export const CreditCheckCommandSchema = z.object({
  keyId: z.string(),
  amount: z.number().int().positive(),
});


export const UpdateRemainingCreditsCommandSchema = z.object({
  amount: z.number().int(),
  userId: z.string(),
  keyId: z.string(),
  operationType: z.enum(['increment', 'decrement']),
});

export const UpdateRemainingCreditsCommandOutputSchema = z.object({
  remaining: z.number().int().nullable(),
});

export type UpdateRemainingCreditsCommandOutput = z.infer<typeof UpdateRemainingCreditsCommandOutputSchema>;
export type UpdateRemainingCreditsCommand = z.infer<typeof UpdateRemainingCreditsCommandSchema>;
export type CreditCheckCommand = z.infer<typeof CreditCheckCommandSchema>;

export interface ICreditManagerTool {
  getCurrentCredits: (userId: string) => Promise<number>;
  checkCredits: (command: CreditCheckCommand) => Promise<boolean>;
  updateRemainingCredits: (command: UpdateRemainingCreditsCommand) => Promise<UpdateRemainingCreditsCommandOutput>;
}
