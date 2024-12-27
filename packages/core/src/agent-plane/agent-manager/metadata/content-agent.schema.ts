import { z } from 'zod';

export enum Status {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed',
}


export const VariationSchema = z.object({
    variationId: z.string().uuid(),

});
// export const AgentCommandInputSchema = z.object({
//     experimentId: z.string().uuid(),
// });

export const GenerateContentCommandInputSchema = z.object({
    prompt: z.string(),
});

export const GenerateContentCommandOutputSchema = z.object({
    content: z.string(),
});
    
export type GenerateContentCommandInput = z.infer<typeof GenerateContentCommandInputSchema>;
export type GenerateContentCommandOutput = z.infer<typeof GenerateContentCommandOutputSchema>;  