export const usersTable = new aws.dynamodb.Table("UsersTable", {
    attributes: [
        {name: "userId", type: "S"}
    ],
    hashKey: "userId",
    billingMode: "PAY_PER_REQUEST",
    streamEnabled: true,
    streamViewType: "NEW_AND_OLD_IMAGES"
})

export const apiKeysTable = new aws.dynamodb.Table("ApiKeysTable", {
    attributes: [
        {name: "apiKey", type: "S"}
    ],
    hashKey: "apiKey",
    billingMode: "PAY_PER_REQUEST",
    streamEnabled: true,
    streamViewType: "NEW_IMAGE"
})

export const websiteReviewTable = new aws.dynamodb.Table("WebsiteReviewTable", {
    attributes: [
        {name: "websiteId", type: "S"}
    ],
    hashKey: "websiteId",
    billingMode: "PAY_PER_REQUEST",
})

export const agentsTable = new aws.dynamodb.Table("AgentsTable", {
    attributes: [
        {name: "agentId", type: "S"}
    ],
    hashKey: "agentId",
    billingMode: "PAY_PER_REQUEST",
})