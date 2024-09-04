// Responsible for handling entry point API Gateway events and sending them to the appropriate queue
import { createHandler } from "@utils/src/custom-handler";
import { aiGeneratorAdapter } from "@orchestrator/adapters/primary/content-generator-service.adapter";
import { getUserContentAdapter } from "@orchestrator/adapters/primary/user.adapter";

export const handleContentGenerationRequest = createHandler(aiGeneratorAdapter);
export const handleGetUserContentRequest = createHandler(getUserContentAdapter);
