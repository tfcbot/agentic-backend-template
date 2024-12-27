import { z } from "zod";


export const WebsiteReviewSchema = z.object({
  copywriting_analysis: z.object({
    headline_effectiveness: z.object({
      clarity: z.string(),
      benefit_focused: z.string(),
      urgency_factor: z.string(),
      emotional_appeal: z.number().min(0).max(10)
    }),
    value_proposition: z.object({
      unique_selling_points: z.array(z.string()),
      benefit_clarity: z.string(),
      pain_point_addressing: z.string()
    }),
    persuasion_elements: z.object({
      social_proof: z.string(),
      credibility_indicators: z.string(),
      risk_reducers: z.string()
    }),
    call_to_action: z.object({
      clarity: z.string(),
      placement: z.string(),
      compelling_factor: z.string()
    }),
    content_engagement: z.object({
      readability: z.string(),
      scannability: z.string(),
      emotional_triggers: z.array(z.string())
    }),
    conversion_optimization: z.object({
      friction_points: z.array(z.string()),
      trust_elements: z.string()
    }),
    recommendations: z.array(z.string())
  }),
});


export type WebsiteReview = z.infer<typeof WebsiteReviewSchema>;

export const websiteReviewAgentSystemPrompt = () => `You are a professional website reviewer. 
   Analyze the provided markdown content and provide a structured response in JSON format.
    do not include any other text or comments.
    Keep your analysis thorough but concise. Focus on actionable insights.`;

export const websiteReviewPrompt = (url: string) => {
    return `Please review the website at ${url} and provide a detailed analysis.`;
}