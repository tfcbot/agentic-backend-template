import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetRemainingCreditsInputSchema } from '@orchestrator/metadata/credits.schema';
import { HttpStatusCode } from '@utils/tools/http-status';
import { ValidUser } from '@utils/metadata/saas-identity.schema';
import { createError, handleError } from '@utils/tools/custom-error';
import { SaaSIdentityVendingMachine } from '@utils/tools/saas-identity';
import { OrchestratorHttpResponses } from '@orchestrator/metadata/http-responses.schema';
import { getRemainingCreditsUseCase } from '@orchestrator/usecases/get-remaining-credits.usecase';

export const getRemainingCreditsAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const svm = new SaaSIdentityVendingMachine();
    const validUser: ValidUser = await svm.getValidUser(event);

    if (!validUser.userId) {
      throw createError(HttpStatusCode.BAD_REQUEST, "Missing user id");
    }

    const validatedInput = GetRemainingCreditsInputSchema.parse({ userId: validUser.userId });
    console.log("Getting remaining credits for:", validatedInput);
    const remainingCredits = await getRemainingCreditsUseCase(validatedInput);

    return OrchestratorHttpResponses.UserRemainingCredits({
      body: remainingCredits
    });
  } catch (error) {
    return handleError(error);
  }
};

