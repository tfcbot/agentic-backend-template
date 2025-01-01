import { createHandler, createDynamoDBStreamHandler, createSQSHandler } from "@utils/tools/custom-handler";
import { checkoutAdapter } from "@control-plane/billing/adapters/primary/checkout.adapter";
import { checkoutSessionWebhookAdapter } from "@control-plane/billing/adapters/primary/checkout-session-completed.adapter";
import { registerUserAdapter } from "@control-plane/user/adapters/primary/register-user.adapter";
import { onboardingAdapter } from "@control-plane/user/adapters/primary/onboarding.adapter";
import { createApiKeyAdapter } from "@control-plane/user/adapters/primary/create-api-key.adapter";
import { updateTokenKeyIdAdapter } from "@control-plane/auth-manager/adapters/primary/update-keyid-property.adapter";
import { updateOnboardingAdapter } from "@control-plane/auth-manager/adapters/primary/update-onboarding-status.adapter";

export const checkout = createHandler(checkoutAdapter);
export const checkoutSessionWebhook = createHandler(checkoutSessionWebhookAdapter);
export const handleUserSignup = createHandler(registerUserAdapter);



export const handleOnboardingMessage = createSQSHandler(onboardingAdapter);
export const createApiKeyStreamHandler = createDynamoDBStreamHandler(createApiKeyAdapter);
export const updateTokenKeyIdStreamHandler = createDynamoDBStreamHandler(updateTokenKeyIdAdapter);
export const handleOnboardingStream = createDynamoDBStreamHandler(updateOnboardingAdapter);
