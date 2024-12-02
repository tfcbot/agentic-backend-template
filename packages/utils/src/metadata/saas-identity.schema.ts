import { z } from 'zod';

export const ValidUserSchema = z.object({
  userId: z.string(),
});

export const MessageSchema = z.object({
  message: z.string(),
});

export type ValidUser = z.infer<typeof ValidUserSchema>;
export type Message = z.infer<typeof MessageSchema>;
