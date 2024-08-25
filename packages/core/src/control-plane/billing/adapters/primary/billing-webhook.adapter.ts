import { updateBillingStatusUsecase } from "@control-plane/billing/usecases/update-billing-status.usecase";	
import { 
    OnboardingStatus, 
    PaymentStatus, 
    User, 
    checkoutSessionCompletedSchema, 
} from "@control-plane/billing/metadata/billing.schema";

const Stripe = require('stripe');	
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);	


export const billingWebhookAdapter = async (event: any) => {	
    const signature = event.headers["stripe-signature"];	
    let stripeEvent;	
    try {	
        stripeEvent = await stripe.webhooks.constructEvent(event.body, signature, process.env.STRIPE_WEBHOOK_SECRET);	
    } catch (err) {	
        console.error("Stripe webhook signature verification failed:", err);	
        return { statusCode: 400, body: "Invalid signature" };	
    }	
    const session = stripeEvent.data.object;	
    switch (stripeEvent.type) {	
        case "checkout.session.completed": 	
            const validSession = checkoutSessionCompletedSchema.parse(session)
            const paidUser: User = {
                userId: validSession.metadata.userId,
                paymentStatus: PaymentStatus.paid, 
                onboardingStatus: OnboardingStatus.complete
            }
            await updateBillingStatusUsecase(paidUser);	
            break;	

    }	

    return {	
        statusCode: 200,	
        body: JSON.stringify({ message: "Billing event processed successfully" }),	
    };	
}