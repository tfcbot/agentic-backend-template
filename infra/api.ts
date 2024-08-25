import { usersTable } from "./database";
import { agentAlias, agentResource } from "./agents";

const stripeSecretKey = new sst.Secret('StripeSecretKey')
const stripeWebhookSecret = new sst.Secret('StripeWebhookSecret')
const clerkWebhookSecret = new sst.Secret('ClerkWebhookSecret')
const priceId = new sst.Secret("PriceID")
const clerkPemKey = new sst.Secret("ClerkPEMKey")

// const allowedOrigin = $app.stage === "main" 
//   ? "https://app.example.com"
//   : `https://${$app.stage}-dash.example.com`;

export const api = new sst.aws.ApiGatewayV2('BackendApi', {
//   domain: {
//     name: `api-${$app.stage}.example.com`
//   }, 
}); 

api.route("POST /checkout", {
  link: [usersTable, stripeSecretKey],
  handler: "./packages/functions/src/api.handleCheckout",
  environment: {
    STRIPE_SECRET_KEY: stripeSecretKey.value,
    REDIRECT_SUCCESS_URL: $app.stage == "main" ? "https://app.example.com": `https://${$app.stage}-dash.example.com`, 
    REDIRECT_FAILURE_URL: $app.stage == "main" ? "https://app.example.com": `https://${$app.stage}-dash.example.com`, 
    PRICE_ID: priceId.value,
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value
  }, 
})

api.route("POST /stripe-webhook", {
  link: [usersTable, stripeSecretKey], 
  handler: "./packages/functions/src/api.handleBillingEvents", 
  environment: {
    STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value 
  }, 
})

api.route("POST /clerk-signup", {
  link: [usersTable, clerkWebhookSecret], 
  handler: "./packages/functions/src/api.handleClerkSignUp", 
  environment: {
    CLERK_WEBHOOK_SECRET: clerkWebhookSecret.value, 
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value
  }
})

api.route('GET /users', {
  link: [usersTable],
  handler: "./packages/functions/src/api.handleGetUser", 
  environment: {
  //  ALLOWED_ORIGIN: allowedOrigin, 
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value
  }
})

api.route("POST /agent-action", {
  link: [],
  handler: "./packages/functions/src/api.handleAgentAction",
  environment: {
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value,
    AGENT_ID: agentResource.agentId,
    AGENT_ALIAS_ID: agentAlias.agentAliasId
  }
});

// Additional routes can be added here as needed