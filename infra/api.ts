import { 
  usersTable,
  websiteReviewTable
 } from "./database";
import { 
  clerkWebhookSecret,
  clerkClientPublishableKey,
  clerkClientSecretKey,
  priceId,
  stripeSecretKey,
  stripeWebhookSecret,
  secrets
 } from "./secrets";
import { tasksTopic } from "./topic";

const BASE_DOMAIN = process.env.BASE_DOMAIN;

export const apiDomainName = $app.stage === "prod" 
  ? `api.${BASE_DOMAIN}`
  : `${$app.stage}-api.${BASE_DOMAIN}`;

export const appDomainName = $app.stage === "prod" 
  ? `app.${BASE_DOMAIN}`
  : `${$app.stage}-app.${BASE_DOMAIN}`; 


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
const topics = [tasksTopic]
const tables = [usersTable, websiteReviewTable]


const apiResources = [
  ...queues,
  ...topics,
  ...tables,
  ...secrets,
]

api.route("POST /checkout", {
  link: [usersTable, ...secrets],
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
  link: [usersTable, ...secrets], 
  handler: "./packages/functions/src/control-plane.api.checkoutSessionWebhook", 
  environment: {
    STRIPE_WEBHOOK_SECRET: stripeWebhookSecret.value,
  }, 
})

api.route("POST /signup-webhook", {
  link: [...apiResources], 
  handler: "./packages/functions/src/control-plane.api.handleUserSignup", 
})


api.route("GET /agents", {
  link: [...apiResources],
  handler: "./packages/functions/src/orchestrator.api.handleGetAgents",
})

api.route("POST /request-website-review", {
  link: [...apiResources],
  handler: "./packages/functions/src/orchestrator.api.handleRequestWebsiteReview",
});


api.route("GET /website-reviews", {
  link: [...apiResources], 
  handler: "./packages/functions/src/orchestrator.api.handleGetUserWebsiteReviews",
})




