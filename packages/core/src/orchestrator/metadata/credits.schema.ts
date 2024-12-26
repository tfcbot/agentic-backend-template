import { z } from 'zod';



export const GetRemainingCreditsInputSchema = z.object({
  keyId: z.string(),
});

export type GetRemainingCreditsInput = z.infer<typeof GetRemainingCreditsInputSchema>;

export const GetRemainingCreditsOutputSchema = z.object({
  credits: z.number(),
});

export type GetRemainingCreditsOutput = z.infer<typeof GetRemainingCreditsOutputSchema>;

// New schemas for returning credits
export const ReturnCreditsTaskSchema = z.object({
  apiKey: z.string(),
  amount: z.number().positive(),
});

export type ReturnCreditsTask = z.infer<typeof ReturnCreditsTaskSchema>;
