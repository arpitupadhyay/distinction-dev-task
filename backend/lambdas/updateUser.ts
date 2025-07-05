import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { createResponse } from "./utils/response"; // adjust path as needed

const db = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  const data = JSON.parse(event.body || "{}");

  if (!id || !data.name || !data.email || !data.city || !data.country) {
    return createResponse(400, { message: "Missing required fields" });
  }

  try {
    const result = await db
      .update({
        TableName: tableName,
        Key: { id },
        UpdateExpression:
          "set #name = :name, #email = :email, #city = :city, #country = :country",
        ExpressionAttributeNames: {
          "#name": "name",
          "#email": "email",
          "#city": "city",
          "#country": "country",
        },
        ExpressionAttributeValues: {
          ":name": data.name,
          ":email": data.email,
          ":city": data.city,
          ":country": data.country,
        },
      })
      .promise();

    return createResponse(200, { message: "User updated" });
  } catch (err) {
    return createResponse(500, {
      message: "Failed to update user",
      error: (err as any)?.message,
    });
  }
};
