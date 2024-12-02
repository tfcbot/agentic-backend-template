export const usersTable = new aws.dynamodb.Table("UsersTable", {
    attributes: [
        {name: "id", type: "S"}
    ],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST",
})

export const contentTable = new aws.dynamodb.Table("ContentTable", {
    attributes: [
        {name: "id", type: "S"}
    ],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST",
})
