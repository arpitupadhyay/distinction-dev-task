import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { createResponse } from "./utils/response";

const db = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return createResponse(400, { message: "Missing user ID in path" });
  }

  try {
    await db
      .delete({
        TableName: tableName,
        Key: { id },
      })
      .promise();

    return createResponse(200, { message: "User deleted" });
  } catch (err) {
    return createResponse(500, {
      message: "Failed to delete user",
      error: (err as any)?.message,
    });
  }
};
