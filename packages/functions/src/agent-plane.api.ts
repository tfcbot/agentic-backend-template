// Lambda Handlers attached to the queues as entry points to services
import { createSQSHandler } from "@utils/src/tools/custom-handler";
import { reviewWebsiteAdapter } from "@agent-plane/website-reviewer/adapters/primary/review-website.adapter";

export const websiteReviewHandler = createSQSHandler(reviewWebsiteAdapter);
