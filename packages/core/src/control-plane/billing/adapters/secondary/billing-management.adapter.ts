import { CheckoutInfo, User } from "@control-plane/billing/metadata/billing.schema";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, TransactWriteCommand, UpdateCommand, UpdateCommandInput } from "@aws-sdk/lib-dynamodb";

// @ts-ignore
import { Resource } from "sst";


const dynamoClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


export async function createSession(checkoutInfo: CheckoutInfo): Promise<{}> {
    const redirect_success_url = process.env.REDIRECT_SUCCESS_URL
    const redirect_failure_url =  process.env.REDIRECT_SUCCESS_URL
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: checkoutInfo.priceId,
                    quantity: checkoutInfo.quantity,
                },
            ],
            mode: 'subscription',
            success_url: redirect_success_url, 
            cancel_url: redirect_failure_url,
            metadata: {
                userId: checkoutInfo.userId
            }
        });
        console.log(`Session created with ID: ${session.id}`);
        return { "url": session.url }
    } catch (error) {
        console.error("Error creating Stripe checkout session:", error);
        throw new Error("Failed to create Stripe checkout session");
    }
}

export async function updateBillingStatus(user: User) {	
    try {
        const params: UpdateCommandInput = {
            TableName: Resource.Users.tableName,
            Key: { userId: user.userId },
            UpdateExpression: 'SET paymentStatus = :paymentStatus, onboardingStatus = :onboardingStatus',
            ExpressionAttributeValues: {
                ':paymentStatus': user.paymentStatus,
                ':onboardingStatus': user.onboardingStatus
            },
            ReturnValues: 'UPDATED_NEW'
        };

        const command = new UpdateCommand(params);
        const result = await dynamoClient.send(command);

        console.log(`Updated plan status for user ${user.userId} to ${user.paymentStatus} and onboarding status to COMPLETE`);
        return result;
    } catch (error) {
        console.error('Error updating user status:', error);
        throw new Error('Failed to update user status');
    }
}

