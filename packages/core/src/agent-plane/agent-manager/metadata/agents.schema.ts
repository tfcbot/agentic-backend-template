import { z } from "zod";


export const AgentSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const CreateAgentInputSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    type: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const CreateAgentOutputSchema = z.object({
    message: z.string()
});

export const GetAgentsInputSchema = z.object({
    userId: z.string()
});


export const GetAgentsOutputSchema = z.object({
    agents: z.array(AgentSchema)
});

export const GetAgentByIdInputSchema = z.object({
    agentId: z.string()
});

export const GetAgentByIdOutputSchema = z.object({
    agent: AgentSchema
});

export type GetAgentsOutput = z.infer<typeof GetAgentsOutputSchema>;
export type GetAgentsInput = z.infer<typeof GetAgentsInputSchema>;
export type GetAgentByIdInput = z.infer<typeof GetAgentByIdInputSchema>;
export type GetAgentByIdOutput = z.infer<typeof GetAgentByIdOutputSchema>;
export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>;
export type CreateAgentOutput = z.infer<typeof CreateAgentOutputSchema>;