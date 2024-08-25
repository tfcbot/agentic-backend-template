/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    "BackendApi": {
      "type": "sst.aws.ApiGatewayV2"
      "url": string
    }
    "Bucket": {
      "name": string
      "type": "sst.aws.Bucket"
    }
    "ClerkPEMKey": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ClerkWebhookSecret": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "ContentQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "JobDLQ": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "JobQueue": {
      "type": "sst.aws.Queue"
      "url": string
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
    "UserQueue": {
      "type": "sst.aws.Queue"
      "url": string
    }
    "executor": {
      "name": string
      "type": "sst.aws.Function"
    }
    "users": {
      "tableName": string
      "type": "aws.dynamodb/table.Table"
    }
  }
}
export {}
