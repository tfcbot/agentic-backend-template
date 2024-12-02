import { 
  usersTable,
  contentTable
 } from "./database";
import { stripeSecretKey, stripeWebhookSecret, clerkWebhookSecret, priceId, clerkClientPublishableKey, clerkClientSecretKey } from "./secrets";


const DOMAIN_NAME = process.env.DOMAIN_NAME;

export const apiDomainName = $app.stage === "prod" 
  ? `api.${DOMAIN_NAME}`
  : `${$app.stage}-api.${DOMAIN_NAME}`;

export const appDomainName = $app.stage === "prod" 
  ? `app.${DOMAIN_NAME}`
  : `${$app.stage}-app.${DOMAIN_NAME}`; 


export const api = new sst.aws.ApiGatewayV2('BackendApi', {
    domain: {
      name: apiDomainName,
      path: "v1",
      dns: sst.cloudflare.dns({
        transform: {
          record: (record) => {
            if (record.name === apiDomainName) {
              record.proxied = true;
              record.ttl = 1;
            }
          }
        }
      })
    }, 
    cors: {
      allowOrigins: [
        `https://${appDomainName}`,
        "http://localhost:3000",
      ]
    }
  }); 

const queues = []
const topics = []
const tables = [usersTable]
const secrets = [stripeSecretKey, stripeWebhookSecret, clerkWebhookSecret, priceId, clerkClientPublishableKey]

const apiResources = [
  ...queues,
  ...topics,
  ...tables,
  ...secrets,
]

api.route("POST /checkout", {
  link: [usersTable, stripeSecretKey],
  handler: "./packages/functions/src/control-plane.api.checkout",
  environment: {
    STRIPE_SECRET_KEY: stripeSecretKey.value,
    REDIRECT_SUCCESS_URL: `https://${appDomainName}`,
    REDIRECT_FAILURE_URL: `https://${appDomainName}`,
    PRICE_ID: priceId.value,
    CLERK_CLIENT_PUBLISHABLE_KEY: clerkClientPublishableKey.value,
    CLERK_CLIENT_SECRET_KEY: clerkClientSecretKey.value,
    CLERK_WEBHOOK_SECRET: clerkWebhookSecret.value,
  }, 
})

api.route("POST /checkout-webhook", {
  link: [usersTable, stripeSecretKey], 
  handler: "./packages/functions/src/control-plane.api.billingWebhook", 
  environment: {
    STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
  }, 
})

api.route("POST /signup-webhook", {
  link: [...apiResources], 
  handler: "./packages/functions/src/control-plane.api.handleUserSignup", 
})



api.route("GET /content", {
  link: [...apiResources], 
  handler: "./packages/functions/src/orchestrator.api.handleGetUserContentRequest",
})



api.route("POST /content/generate", {
  link: [...apiResources],
  handler: "./packages/functions/src/orchestrator.api.handleConentGenerationRequest",
});
