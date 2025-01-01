/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "AgentsTable": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
    "ApiKeyStreamProcessor": {
      "name": string
      "type": "sst.aws.Function"
    }
    "ApiKeysTable": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
    "BackendApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "ClerkClientPublishableKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ClerkClientSecretKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ClerkWebhookSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "CreateApiKeyStreamProcessor": {
      "name": string
      "type": "sst.aws.Function"
    }
    "DLQ": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "OnboardingStreamProcessor": {
      "name": string
      "type": "sst.aws.Function"
    }
    "OpenAIApiKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "PriceID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "StripeSecretKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "StripeWebhookSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "TasksTopic": {
      "arn": string
      "type": "sst.aws.SnsTopic"
    }
    "UnkeyApiId": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "UnkeyRootKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "UsersTable": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
    "WebsiteReviewQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "WebsiteReviewTable": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
  }
}
export {}
