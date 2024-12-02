// Responsible for handling entry point API Gateway events and sending them to the appropriate queue
import { createHandler } from "../../utils/src/tools/custom-handler";
import { getUserContentAdapter } from "@orchestrator/adapters/primary/user.adapter";
import { contentGeneratorAdapter } from "@orchestrator/adapters/primary/content-generator.adapter";


export const handleGetUserContentRequest = createHandler(getUserContentAdapter);
export const handleGenerateContentRequest = createHandler(contentGeneratorAdapter);
