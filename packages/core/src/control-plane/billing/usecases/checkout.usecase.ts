import { CheckoutSessionInput } from "@control-plane/billing/metadata/billing.schema";
import { createSession } from "@control-plane/billing/adapters/secondary/billing-management.adapter"; 

export async function createCheckoutSessionUseCase(params: CheckoutSessionInput) {
    try {
        const session = await createSession(params);
        return session;
    } catch (error) {
        console.error("Failed to create checkout session:", error);
        throw new Error("Checkout session creation failed");
    }
}
