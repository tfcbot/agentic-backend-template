import { CheckoutSessionInput } from "@control-plane/billing/metadata/billing.schema";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// @ts-ignore
import { Resource } from "sst";
import { randomUUID } from "crypto";


const client = new DynamoDBClient({});
const dynamoClient = DynamoDBDocumentClient.from(client);
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


export async function createSession(params: CheckoutSessionInput): Promise<{}> {
    const redirect_success_url = process.env.REDIRECT_SUCCESS_URL;
    const redirect_failure_url = process.env.REDIRECT_FAILURE_URL;
    const idempotencyKey = randomUUID();

    try {
        const metadata = {
            userId: params.userId,
            amount: params.quantity * 5000
        }
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: Resource.PriceID.value,
                    quantity: params.quantity,
                },
            ],
            mode: 'subscription',
            success_url: redirect_success_url,
            cancel_url: redirect_failure_url,
            metadata: metadata
        }, {
            idempotencyKey: idempotencyKey // Pass the idempotency key in the request options
        });

        return { "id": session.id };
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        throw new Error("Failed to create Stripe checkout session");
    }
}

export async function checkoutSessionCompletedFunction(input: any) {
    console.log("---Checkout session completed function---");
    console.log(input);
}
