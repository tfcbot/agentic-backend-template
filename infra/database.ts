export const usersTable = new aws.dynamodb.Table("UsersTable", {
    attributes: [
        {name: "id", type: "S"}
    ],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST",
})

export const generatedContentTable = new aws.dynamodb.Table("GeneratedContentTable", {
    attributes: [
        {name: "id", type: "S"}
    ],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST",
})
