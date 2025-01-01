import { 
   checkoutSessionCompletedSchema,
   PaymentStatus
} from "@control-plane/billing/metadata/billing.schema";

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export const checkoutSessionWebhookAdapter = async (event: any) => {
    console.log("---Checkout session webhook adapter---");
    const signature = event.headers["stripe-signature"];
    let stripeEvent;
    try {
        stripeEvent = await stripe.webhooks.constructEvent(event.body, signature, process.env.STRIPE_WEBHOOK_SECRET);   
    } catch (err) {
        console.error(`⚠️  Webhook signature verification failed.` , err);
        return { statusCode: 400, body: "Invalid signature" };
    }
    const session = stripeEvent.data.object;
    switch (stripeEvent.type) {
        case "checkout.session.completed":
            // Implement Use Case
            break;
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Webhook Event Received" }),
    };
}
