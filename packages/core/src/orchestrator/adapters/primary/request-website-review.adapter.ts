import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ValidUser } from '@utils/metadata/saas-identity.schema';
import { createError, handleError } from '@utils/tools/custom-error';
import { SaaSIdentityVendingMachine } from '@utils/tools/saas-identity';
import { HttpStatusCode } from '@utils/tools/http-status';
import { publishWebsiteReviewTaskUseCase } from '@orchestrator/usecases/request-website-review.usecase';

export const requestWebsiteReviewAdapter = async (
  event: APIGatewayProxyEventV2
): Promise<APIGatewayProxyResultV2> => {
  try {
    const svm = new SaaSIdentityVendingMachine();
    const validUser: ValidUser = await svm.getValidUser(event);

    if (!validUser.userId) {
      throw createError(HttpStatusCode.BAD_REQUEST, "Missing user id");
    }

    if (!event.body) {
      throw createError(HttpStatusCode.BAD_REQUEST, "Missing request body");
    }

    const { websiteUrl } = JSON.parse(event.body);
    
    if (!websiteUrl) {
      throw createError(HttpStatusCode.BAD_REQUEST, "URL is required");
    }

    const result = await publishWebsiteReviewTaskUseCase({
      userId: validUser.userId,
      websiteUrl: websiteUrl
    });

    return {
      statusCode: HttpStatusCode.CREATED,
      body: JSON.stringify(result)
    };

  } catch (error) {
    return handleError(error);
  }
};



