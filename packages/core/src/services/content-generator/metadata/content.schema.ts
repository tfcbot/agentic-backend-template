import { z } from 'zod';


export enum Status {
    Pending = 'Pending',
    InProgress = 'InProgress',
    Completed = 'Completed',
    Failed = 'Failed',
}


export enum TargetPlatform {
    LinkedIn =  'LinkedIn',
    Twitter = 'Twitter',
    Instagram = 'Instagram',
    YouTube = 'Youtube',
    Skool = 'Skool',
  }



export enum Tone {
    Friendly = "Friendly",
    Professional = "Professional",
    Authoritative = "Authoritative",
    Playful = "Playful",
    Serious = "Serious",
    Informative = "Informative",
    Persuasive = "Persuasive",
    Empathetic = "Empathetic"
}


export const ContentGenerationRequestSchema = z.object({
    userId: z.string(),
    briefId: z.string(),
    videoId: z.string().optional(),
    videoUrl: z.string().optional(),
    thumbnailUrl: z.string().optional(),
    targetPlatform: z.nativeEnum(TargetPlatform),
    tone: z.nativeEnum(Tone),
    keypoints: z.string(),
});

export type ContentGenerationRequest = z.infer<typeof ContentGenerationRequestSchema>;


export const ContentGenerationJobSchema = z.object({
    id: z.string(),
    userId: z.string(),
    status: z.nativeEnum(Status),
    prompt: z.string(),
    videoId: z.string(), 
    targetPlatform: z.nativeEnum(TargetPlatform),
    createdAt: z.string(),
    updatedAt: z.string()
});


export type ContentGenerationJob = z.infer<typeof ContentGenerationJobSchema>;

export const ContentSchema = z.object({
    userId: z.string(),
    contentId: z.string().uuid(),
    text: z.string(),
    videoId: z.string(),
    videoTitle: z.string(),
    targetPlatform: z.nativeEnum(TargetPlatform),
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