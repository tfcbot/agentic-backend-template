// Responsible for handling entry point API Gateway events and sending them to the appropriate queue
import { createHandler } from "@utils/tools/custom-handler"
import { requestWebsiteReviewAdapter } from "@orchestrator/adapters/primary/request-website-review.adapter";
import { getRemainingCreditsAdapter } from "@orchestrator/adapters/primary/get-remaining-credits.adapter";

export const handleRequestWebsiteReview = createHandler(requestWebsiteReviewAdapter);
export const handleGetUserCredits = createHandler(getRemainingCreditsAdapter);