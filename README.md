# agentic-backend-template

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
   cd agentic-landing-page
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
ClerkPEMKey=<Your Clerk PEM Key>
```


### Load the secrets into your environment with sst

```
yarn sst secret .env --stage your-stage-name
```



## Deployment

Deploy to your desired stage

```
yarn deploy --stage your-stage-name
```