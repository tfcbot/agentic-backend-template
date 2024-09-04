import { CheckoutInfo } from "@control-plane/billing/metadata/billing.schema";
import { createSession } from "@control-plane/billing/adapters/secondary/billing-management.adapter"; 

export async function createCheckoutSessionUseCase( userId: string) {

    const price_id = process.env.PRICE_ID;
    if (!price_id) {
        throw new Error("PRICE_ID is not set in the environment variables");
    }

    try {
        const checkoutInfo : CheckoutInfo = {
            priceId: price_id,
            quantity: 1,
            userId: userId
        }
        const session = await createSession(checkoutInfo);
        return session;
    } catch (error) {
        console.error("Failed to create checkout session:", error);
        throw new Error("Checkout session creation failed");
    }
}
