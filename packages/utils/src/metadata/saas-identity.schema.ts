import { z } from 'zod';

export const ValidUserSchema = z.object({
  userId: z.string(),
  keyId: z.string().optional(),
});

export const MessageSchema = z.object({
  message: z.string(),
});

export const GetUserDetailsByApiKeyCommandSchema = z.object({ 
  apiKey: z.string(),
});

export const GetUserDetailsByKeyIdCommandSchema = z.object({
  keyId: z.string(),
});

export type ValidUser = z.infer<typeof ValidUserSchema>;
export type Message = z.infer<typeof MessageSchema>;
export type GetUserDetailsByApiKeyCommand = z.infer<typeof GetUserDetailsByApiKeyCommandSchema>;
export type GetUserDetailsByKeyIdCommand = z.infer<typeof GetUserDetailsByKeyIdCommandSchema>;