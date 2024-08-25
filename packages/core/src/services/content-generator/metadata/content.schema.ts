import { z } from 'zod';


export enum Status {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed',
}


export const ContentGenerationRequestSchema = z.object({
    userId: z.string(),
    prompt: z.string(),
});

export type ContentGenerationRequest = z.infer<typeof ContentGenerationRequestSchema>;


export const ContentGenerationJobSchema = z.object({
    id: z.string(),
    userId: z.string(),
    status: z.nativeEnum(Status),
    prompt: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});


export type ContentGenerationJob = z.infer<typeof ContentGenerationJobSchema>;

export const ContentSchema = z.object({
    userId: z.string(),
    contentId: z.string().uuid(),
    text: z.string(),
  });
  
export type Content = z.infer<typeof ContentSchema>;
  

export const GetUserContentInputSchema = z.object({
    userId: z.string(),
  })
  
export const GetUserContentOutputSchema = z.object({
content: z.array(ContentSchema)
});


export type GetUserContentInput = z.infer<typeof GetUserContentInputSchema>; 
export type GetUserContentOutput = z.infer<typeof GetUserContentOutputSchema>; 