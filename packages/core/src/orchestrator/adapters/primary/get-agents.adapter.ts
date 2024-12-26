import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { HttpStatusCode } from '@utils/tools/http-status';
import { ValidUser } from '@utils/metadata/saas-identity.schema';
import { createError, handleError } from '@utils/tools/custom-error';
import { SaaSIdentityVendingMachine } from '@utils/tools/saas-identity';

export const getAgentsAdapter = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
  try {
    const svm = new SaaSIdentityVendingMachine();
    const validUser: ValidUser = await svm.getValidUser(event);

    if (!validUser.userId) {
      throw createError(HttpStatusCode.BAD_REQUEST, "Missing user id");
    }

    // For now, return a static list of available agents
    const agents = [
      {
        id: "website-reviewer",
        name: "Website Reviewer",
        description: "AI agent that reviews websites and provides detailed feedback",
        status: "available"
      }
    ];

    return {
      statusCode: HttpStatusCode.OK,
      body: JSON.stringify({
        agents
      })
    };

  } catch (error) {
    return handleError(error);
  }
};
