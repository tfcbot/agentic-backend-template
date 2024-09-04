// Lambda Handlers attached to the queues as entry points to services
import { createSQSHandler } from "@utils/src/custom-handler";
import { contentGeneratorJobAdapter } from "@services/content-generator/adapters/primary/content-generator.adapter";

export const contentGenerationHandler = createSQSHandler(contentGeneratorJobAdapter);
