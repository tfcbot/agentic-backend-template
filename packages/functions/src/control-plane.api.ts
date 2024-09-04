import { createHandler, createSQSHandler } from "@utils/src/custom-handler";
import { billingWebhookAdapter } from "@control-plane/billing/adapters/primary/billing-webhook.adapter";
import { checkoutAdapter } from "@control-plane/billing/adapters/primary/checkout.adapter";
import { createUserAdapter } from "@control-plane/user/adapters/primary/create-user.adapter";
import { getUserDataAdapter } from "@control-plane/user/adapters/primary/get-user-data.adapter";
import { updateSettingsPublisherAdapter } from "@control-plane/user/adapters/primary/update-settings-publisher.adapter";
import { updateSettingsSubscriberAdapter } from "@control-plane/user/adapters/primary/update-settings-subscriber.adapter";


export const billingWebhook = createHandler(billingWebhookAdapter);
export const checkout = createHandler(checkoutAdapter);
export const handleUserSignup = createHandler(createUserAdapter);
export const getUser = createHandler(getUserDataAdapter);
export const updateSettingsPublisher = createHandler(updateSettingsPublisherAdapter);
export const updateSettingsSubscriber = createSQSHandler(updateSettingsSubscriberAdapter);