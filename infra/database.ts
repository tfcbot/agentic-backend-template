export const usersTable = new aws.dynamodb.Table("UsersTable", {
    attributes: [
        {name: "userId", type: "S"}
    ],
    hashKey: "userId",
    billingMode: "PAY_PER_REQUEST",
})

export const contentTable = new aws.dynamodb.Table("ContentTable", {
    attributes: [
        {name: "contentId", type: "S"}
    ],
    hashKey: "contentId",
    billingMode: "PAY_PER_REQUEST",
})
