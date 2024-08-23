export const usersTable = new aws.dynamodb.Table("users", {
    attributes: [
        {name: "id", type: "S"}
    ],
    hashKey: "id",
    billingMode: "PAY_PER_REQUEST",
})

