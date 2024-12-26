import { z } from "zod";

export const AgentSchema = z.object({
    id: z.string(),
    name: z.string(),
    title: z.string(), 
    description: z.string(),
    imageUrl: z.string(),
    startingPrice: z.number(),
    available: z.boolean(),
    keyDeliverables: z.array(z.string())
});

export const GetAgentsInputSchema = z.object({
    userId: z.string()
});

export const ReviewWebsiteInputSchema = z.object({
    userId: z.string(),
    websiteUrl: z.string()
});

export const GetWebsiteReviewsInputSchema = z.object({
    userId: z.string(),
    websiteUrl: z.string()
});

export const GetRemainingCreditsInputSchema = z.object({
    keyId: z.string()
});


export const GetRemainingCreditsOutputSchema = z.object({
    credits: z.number()
});

export const ReviewWebsiteOutputSchema = z.object({
    review: z.string()
});

export const GetWebsiteReviewsOutputSchema = z.object({
    reviews: z.array(z.string())
});

export const GetAgentsOutputSchema = z.array(AgentSchema);

export type Agent = z.infer<typeof AgentSchema>;
export type GetAgentsInput = z.infer<typeof GetAgentsInputSchema>;
export type GetAgentsOutput = z.infer<typeof GetAgentsOutputSchema>;
export type ReviewWebsiteInput = z.infer<typeof ReviewWebsiteInputSchema>;
export type ReviewWebsiteOutput = z.infer<typeof ReviewWebsiteOutputSchema>;
export type GetWebsiteReviewsInput = z.infer<typeof GetWebsiteReviewsInputSchema>;
export type GetWebsiteReviewsOutput = z.infer<typeof GetWebsiteReviewsOutputSchema>;
export type GetRemainingCreditsInput = z.infer<typeof GetRemainingCreditsInputSchema>;
export type GetRemainingCreditsOutput = z.infer<typeof GetRemainingCreditsOutputSchema>;
