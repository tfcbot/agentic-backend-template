import {ContentGenerationJob } from "src/services/content-generator/metadata/content.schema";
import { invokeContentAgent } from "@services/content-generator/adapters/secondary/content-agent.adapter";

export const generateContentUsecase = async (contentGenerationJob: ContentGenerationJob) => {
    return await invokeContentAgent(contentGenerationJob);
};


