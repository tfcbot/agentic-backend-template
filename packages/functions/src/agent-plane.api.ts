// Lambda Handlers attached to the queues as entry points to services
import { createSQSHandler } from "@utils/src/tools/custom-handler";
import { contentGenerationAdapter } from "@agent-plane/content-generator/adapters/primary/generate-content.adapter";

export const contentGenerationHandler = createSQSHandler(contentGenerationAdapter);
