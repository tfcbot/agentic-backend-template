import { z } from 'zod';
import { Status, Queue } from "@orchestrator/metadata/orchestrator.schema";

export enum TargetPlatform {
  LinkedIn = 'LinkedIn',
  Twitter = 'Twitter',
  Instagram = 'Instagram',
  YouTube = 'Youtube',
  Skool = 'Skool',
}

export const ContentSchema = z.object({
  userId: z.string(),
  contentId: z.string().uuid(),
  text: z.string(),
  videoId: z.string(),
  videoTitle: z.string(),
  targetPlatform: z.nativeEnum(TargetPlatform),
})

export const GetUserContentInputSchema = z.object({
  userId: z.string(),
})

export const GetUserContentOutputSchema = z.object({
  content: z.array(ContentSchema)
});


export const GenerateContentInputSchema = z.object({
  userId: z.string(),
  videoIds: z.array(z.string()),
  prompts: z.record(z.nativeEnum(TargetPlatform), z.string()),
  targetPlatforms: z.array(z.nativeEnum(TargetPlatform)),
});

export const ContentGenerationJobSchema = z.object({
  jobId: z.string().uuid(),
  userId: z.string(),
  videoId: z.string(),
  targetPlatform: z.nativeEnum(TargetPlatform),
  status: z.nativeEnum(Status),
  queue: z.nativeEnum(Queue),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type ContentGenerationJob = z.infer<typeof ContentGenerationJobSchema>
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;
export type GetUserContentInput = z.infer<typeof GetUserContentInputSchema>; 
export type GetUserContentOutput = z.infer<typeof GetUserContentOutputSchema>; 