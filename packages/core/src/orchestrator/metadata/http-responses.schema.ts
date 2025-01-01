import {z} from 'zod';
import { HttpResponseParams, HttpStatusCode, createHttpResponse, HttpResponses } from "@utils/tools/http-status";
import { GetWebsiteReviewsOutput, WebsiteReviewSchema } from './agent-plane.schema';
import { GetRemainingCreditsOutput } from './credits.schema';


export const WebsiteReviewRequestReceivedResponseBody = z.object({
    reviewId: z.string(),
    url: z.string(),
});

export const UserWebsiteReviewsResponseBody = z.object({
    reviews: z.array(WebsiteReviewSchema),
});

export const UserRemainingCreditsResponseBody = z.object({
    remainingCredits: z.number(),
});

export type WebsiteReviewRequestReceivedResponseBody = z.infer<typeof WebsiteReviewRequestReceivedResponseBody>;
export type UserWebsiteReviewsResponseBody = z.infer<typeof UserWebsiteReviewsResponseBody>;
export type UserRemainingCreditsResponseBody = z.infer<typeof UserRemainingCreditsResponseBody>;


export const OrchestratorHttpResponses = {
    ...HttpResponses,
    WebsiteReviewRequestReceived: (params: HttpResponseParams<WebsiteReviewRequestReceivedResponseBody>) => 
      createHttpResponse(HttpStatusCode.CREATED, params),
    UserWebsiteReviews: (params: HttpResponseParams<GetWebsiteReviewsOutput>) => 
      createHttpResponse(HttpStatusCode.OK, params),
    UserRemainingCredits: (params: HttpResponseParams<GetRemainingCreditsOutput>) => 
      createHttpResponse(HttpStatusCode.OK, params),
  };  
  