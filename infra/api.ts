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
  handler: "./packages/functions/src/control-plane.api.checkout",
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
  handler: "./packages/functions/src/control-plane.api.billingWebhook", 
  environment: {
    STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value 
  }, 
})

api.route("POST /clerk-signup", {
  link: [usersTable, clerkWebhookSecret], 
  handler: "./packages/functions/src/control-plane.api.handleUserSignup", 
  environment: {
    CLERK_WEBHOOK_SECRET: clerkWebhookSecret.value, 
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value
  }
})

api.route("POST /settings", {
  link: [], 
  handler: "./packages/functions/src/control-plane.api.updateSettingsPublisher",
  environment: {
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value
  }
})



api.route("GET /content", {
  link: [], 
  handler: "./packages/functions/src/orchestrator.api.handleGetUserContentRequest",
  environment: {
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value
  }
})



api.route("POST /content", {
  link: [],
  handler: "./packages/functions/src/orchestrator.api.handleConentGenerationRequest",
  environment: {
    CLERK_PEM_PUBLIC_KEY: clerkPemKey.value,
    AGENT_ID: agentResource.agentId,
    AGENT_ALIAS_ID: agentAlias.agentAliasId
  }
});

// Additional routes can be added here as needed