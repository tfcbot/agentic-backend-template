/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
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
    "ContentDLQ": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "ContentQueue": {
      "type": "sst.aws.Queue"
      "url": string
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
    "UsersTable": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
    "WebsiteReviewTable": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
  }
}
export {}
