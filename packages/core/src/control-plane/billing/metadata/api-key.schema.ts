import { z } from 'zod';


export const CreateApiKeyCommandSchema = z.object({
  userId: z.string(),
});



export const UserApiKeySchema = z.object({
  apiId: z.string(),
  key: z.string(),
  userId: z.string(),
});

export const ApiKeySchema = z.object({
  id: z.string().optional(),
  apiId: z.string(),
  workspaceId: z.string().optional(),
  start: z.string().optional(),
  name: z.string().optional(),
  ownerId: z.string().optional(),
  meta: z.record(z.any()).optional(),
  createdAt: z.number().optional(),
  deletedAt: z.number().optional(),
  expires: z.number().optional(),
  remaining: z.number().optional(),
  refill: z.object({
    interval: z.enum(['daily', 'monthly']),
    amount: z.number().optional(),
    lastRefillAt: z.number().optional()
  }).optional(),
  ratelimit: z.object({
    type: z.enum(['fast', 'consistent']).default('fast'),
    limit: z.number().optional(),
    refillRate: z.number().optional(),
    refillInterval: z.number().optional()
  }).optional(),
  enabled: z.boolean().default(true)
});


export const SaveApiKeyCommandSchema = z.object({
  apiKey: z.string(),
  userId: z.string(),
  keyId: z.string(),
});


export const UpdateRemainingCreditsCommand = z.object({
  userId: z.string(),
  keyId: z.string(),
  operationType: z.enum(['increment', 'decrement']),
  amount: z.number(),
});

export const DeleteApiKeyCommandInput = z.object({
  userId: z.string(),
  keyId: z.string(),
});


export const CreateApiKeyCommandInputSchema = z.object({
  userId: z.string(),
  prefix: z.string().optional(),
  byteLength: z.number().optional(),
  ownerId: z.string().optional(),
  meta: z.record(z.string()).optional(),
  expires: z.number().optional(),
  remaining: z.number().optional(),
  refill: z.object({
    interval: z.enum(['daily', 'monthly']),
    amount: z.number(),
  }).optional(),
});


export type ApiKey = z.infer<typeof ApiKeySchema>;
export type UserApiKey = z.infer<typeof UserApiKeySchema>;
export type CreateApiKeyCommand = z.infer<typeof CreateApiKeyCommandSchema>;
export type SaveApiKeyCommand = z.infer<typeof SaveApiKeyCommandSchema>;
export type DeleteApiKeyCommandInput = z.infer<typeof DeleteApiKeyCommandInput>;  
export type CreateApiKeyCommandInput = z.infer<typeof CreateApiKeyCommandInputSchema>;
