# agentic-api-template

This project is built using [SSTv3](https://sst.dev/), [Pulumi](https://www.pulumi.com/), [Stripe](https://stripe.com/) and [Clerk](https://clerk.com/).

## Prerequisites

- Node.js 18 or later
- npm or yarn
- AWS Credentials Configured
- Export your AWS profile 

    ```
    export AWS_PROFILE=<ProfileName>
    ```

## Getting Started

### Clone the repository:
   ```
   git clone <repo-url>
   cd agentic-api-template
   ```

### Initialize SST in the project
   ```
   npx sst@latest init
   ```

### Create a `.env` file in the root of the project and add the following environment variables:

```
StripePubKey=<Your Stripe Publishable Key>
StripeSecretKey=<Your Stripe Secret Key>
StripeWebhookSecret=<Your Stripe Webhook Secret>
PriceID=<Your Stripe Price ID>
ClerkPubKey=<Your Clerk Publishable Key>
ClerkWebhookSecret=<Your Clerk Webhook Secret>
```


### Load the secrets into your environment with sst

```
yarn sst secret .env --stage your-stage-name
```

### Running Tests 

Create a `.env.test` file in the root of the project and add the following environment variables:
Provide a test access token for running the api level tests

```
AccessToken=<Your Access Token>
```


## Deployment

Deploy to your desired stage

```
yarn deploy --stage your-stage-name
```

## Endpoints 
The API exposes the following endpoints:

### Authentication & Billing

#### POST /checkout
Initiates a Stripe checkout session for user subscription.

#### POST /checkout-webhook 
Handles Stripe webhook events for billing-related notifications.

#### POST /signup-webhook
Handles user signup events from Clerk authentication service.

### Content Management

#### GET /content
Retrieves user content.

#### POST /generate-content
Generates new content for the user.

All endpoints are protected and require authentication via Oauth Access token from Clerk. The API is accessible at:
- Production: `api.${DOMAIN_NAME}/v1`
- Other stages: `${stage}-api.${DOMAIN_NAME}/v1`

CORS is enabled for


## Note
This is a reference implementation meant for starting a new api project. As of now there are no plans to add addtional features or integrations.

Please do not use this directly in production without testing and ensuring it meets your needs. 

Do not submit any PRs or issues for this repository. 