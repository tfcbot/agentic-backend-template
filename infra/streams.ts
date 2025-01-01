import {
    apiKeysTable,
    usersTable
} from "./database";
import { secrets } from "./secrets";




const onboardingStreamProcessor = new sst.aws.Function("OnboardingStreamProcessor", {
    handler: "./packages/functions/src/control-plane.api.handleOnboardingStream",
    link: [
        usersTable, 
        ...secrets
    ]
})


const onboardingStreamProcessorEventSourceMapping = new aws.lambda.EventSourceMapping("onboardingStreamProcessorEventSourceMapping", {
    eventSourceArn: usersTable.streamArn, 
    functionName: onboardingStreamProcessor.arn,
    batchSize: 100,
    maximumBatchingWindowInSeconds: 10,
    startingPosition: "LATEST"
})

const createApiKeyStreamProcessor = new sst.aws.Function("CreateApiKeyStreamProcessor", {
    handler: "./packages/functions/src/control-plane.api.createApiKeyStreamHandler",
    link: [usersTable,  apiKeysTable, ...secrets]
})

const createApiKeyStreamProcessorEventSourceMapping = new aws.lambda.EventSourceMapping("createApiKeyStreamProcessorEventSourceMapping", {
    eventSourceArn: usersTable.streamArn, 
    functionName: createApiKeyStreamProcessor.arn,
    batchSize: 100,
    maximumBatchingWindowInSeconds: 10,
    startingPosition: "LATEST"
})




const apiKeyStreamProcessor = new sst.aws.Function("ApiKeyStreamProcessor", {
    handler: "./packages/functions/src/control-plane.api.updateTokenKeyIdHandler",
    link: [apiKeysTable, ...secrets]
})

const updateTokenKeyIdStreamProcessorEventSourceMapping = new aws.lambda.EventSourceMapping("updateTokenKeyIdStreamProcessorEventSourceMapping", {
    eventSourceArn: apiKeysTable.streamArn, 
    functionName: apiKeyStreamProcessor.arn,
    batchSize: 100,
    maximumBatchingWindowInSeconds: 10,
    startingPosition: "LATEST"
})


export const streams = [
    onboardingStreamProcessorEventSourceMapping,
    createApiKeyStreamProcessorEventSourceMapping,
    updateTokenKeyIdStreamProcessorEventSourceMapping
]

export const eventSourceMappings = [
    onboardingStreamProcessorEventSourceMapping,
    createApiKeyStreamProcessorEventSourceMapping,
    updateTokenKeyIdStreamProcessorEventSourceMapping
]