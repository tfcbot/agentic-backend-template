
import { z } from 'zod';


export const ValidateApiKeyCommandSchema = z.object({
  keyId: z.string(),
});

export const GetApiKeyCommandInputSchema = z.object({
  keyId: z.string(),
  decrypt: z.boolean().optional(),  
});

export const GetApiKeyCommandOutputSchema = z.object({
  id: z.string(),
  start: z.string(),
  workspaceId: z.string(),
  apiId: z.string().optional(),
  name: z.string().optional(),
  ownerId: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional(),
  expires: z.number().optional(),
  remaining: z.number().optional(),
  refill: z.object({
    interval: z.string().optional(),
    amount: z.number().optional(),
  }).optional(),
  ratelimit: z.object({
    async: z.boolean(),
    limit: z.number().optional(),
    duration: z.number().optional(),
  }).optional(),
  roles: z.array(z.string()).optional(),
  permissions: z.array(z.string()).optional(),
  enabled: z.boolean().optional(),
  plaintext: z.string().optional(),
  identity: z.object({
    id: z.string(),
    externalId: z.string(),
    meta: z.record(z.unknown()).optional(),
  }).optional(),
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

export const CreateApiKeyCommandOutputSchema = z.object({
  key: z.string(),
  keyId: z.string(),
});

export const UpdateApiKeyCommandInputSchema = z.object({
  keyId: z.string(),
  op: z.enum(['increment', 'decrement']),
  value: z.number(),
});

export const UpdateApiKeyCommandOutputSchema = z.object({
  remaining: z.number().nullable(),
});

export const DeleteApiKeyCommandInputSchema = z.object({
  keyId: z.string(),
});

export const DeleteApiKeyCommandOutputSchema = z.object({
  message: z.string(),
});

export const SaveApiKeyCommandSchema = z.object({
  userId: z.string(),
  apiKey: z.string(),
  keyId: z.string(),
});

export const SaveApiKeyCommandOutputSchema = z.object({
  message: z.string(),
});

export const ApiKeySchema = z.object({
  key: z.string(),
});

export const ValidateApiKeyCommandOutputSchema = z.object({
  keyId: z.string().optional(),
  valid: z.boolean(),
  name: z.string().optional(),
  ownerId: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
  expires: z.number().optional(),
  ratelimit: z.object({
    limit: z.number(),
    remaining: z.number(),
    reset: z.number(),
  }).optional(),
  remaining: z.number().optional(),
  code: z.enum(['VALID', 'NOT_FOUND', 'FORBIDDEN', 'USAGE_EXCEEDED', 'RATE_LIMITED', 'UNAUTHORIZED', 'DISABLED', 'INSUFFICIENT_PERMISSIONS', 'EXPIRED']),
  enabled: z.boolean().optional(),
  permissions: z.array(z.string()).optional(),
  environment: z.string().optional(),
  identity: z.object({
    id: z.string(),
    externalId: z.string(),
    meta: z.record(z.unknown()),
  }).optional(),
});


export type ValidateApiKeyCommand = z.infer<typeof ValidateApiKeyCommandSchema>;
export type ValidateApiKeyCommandOutput = z.infer<typeof ValidateApiKeyCommandOutputSchema>;
export type GetApiKeyCommandInput = z.infer<typeof GetApiKeyCommandInputSchema>;
export type GetApiKeyCommandOutput = z.infer<typeof GetApiKeyCommandOutputSchema>;
export type CreateApiKeyCommandInput = z.infer<typeof CreateApiKeyCommandInputSchema>;
export type CreateApiKeyCommandOutput = z.infer<typeof CreateApiKeyCommandOutputSchema>;
export type UpdateApiKeyCommandInput = z.infer<typeof UpdateApiKeyCommandInputSchema>;
export type UpdateApiKeyCommandOutput = z.infer<typeof UpdateApiKeyCommandOutputSchema>;
export type DeleteApiKeyCommandInput = z.infer<typeof DeleteApiKeyCommandInputSchema>;
export type DeleteApiKeyCommandOutput = z.infer<typeof DeleteApiKeyCommandOutputSchema>;
export type SaveApiKeyCommand = z.infer<typeof SaveApiKeyCommandSchema>;
export type SaveApiKeyCommandOutput = z.infer<typeof SaveApiKeyCommandOutputSchema>;
export type ApiKey = z.infer<typeof ApiKeySchema>;

