import { createHandler } from "@utils/tools/custom-handler";
import { checkoutAdapter } from "@control-plane/billing/adapters/primary/checkout.adapter";
import { checkoutSessionWebhookAdapter } from "@control-plane/billing/adapters/primary/checkout-session-completed.adapter";
import { registerUserAdapter } from "@control-plane/user/adapters/primary/register-user.adapter";



export const checkout = createHandler(checkoutAdapter);
export const checkoutSessionWebhook = createHandler(checkoutSessionWebhookAdapter);
export const handleUserSignup = createHandler(registerUserAdapter);


