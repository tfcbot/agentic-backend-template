import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { generateContentUseCase  } from '@orchestrator/usecases/publish-generate-content-job.usecase';
import { GenerateContentInputSchema } from '@orchestrator/metadata/content-generator.schema'
import { ContentGeneratorHttpResponses } from '@orchestrator/metadata/content-generator.schema';
import { HttpStatusCode } from '@utils/tools/http-status';
import { ValidUser } from '@utils/metadata/saas-identity.schema';
import { createError, handleError } from '@utils/tools/custom-error';
import { SaaSIdentityVendingMachine } from '@utils/tools/saas-identity';


export const contentGeneratorAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const svm = new SaaSIdentityVendingMachine();
    const validUser: ValidUser = await svm.getValidUser(event);

    if (!validUser.userId) {
      throw createError(HttpStatusCode.BAD_REQUEST, "Missing user id");
    }
    
    if (!event.body) {
      throw createError(HttpStatusCode.BAD_REQUEST, "Missing request body");
    }
    
    const body = JSON.parse(event.body);
    
    const validatedInput = GenerateContentInputSchema.parse({ ...body, userId: validUser.userId });
    console.log("Starting AI Action:", validatedInput);
    const result = await generateContentUseCase(validatedInput);

    return ContentGeneratorHttpResponses.CONTENT_GENERATED({
      body: result
    });
  } catch (error) {
    return handleError(error);
  }
};