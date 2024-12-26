export const usersTable = new aws.dynamodb.Table("UsersTable", {
    attributes: [
        {name: "userId", type: "S"}
    ],
    hashKey: "userId",
    billingMode: "PAY_PER_REQUEST",
})

export const websiteReviewTable = new aws.dynamodb.Table("WebsiteReviewTable", {
    attributes: [
        {name: "websiteId", type: "S"}
    ],
    hashKey: "websiteId",
    billingMode: "PAY_PER_REQUEST",
})