import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { createResponse } from "../layers/common/nodejs/utils/response";

const db = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;

  if (!id) {
    return createResponse(400, { message: "Missing user ID in path" });
  }

  try {
    const result = await db
      .get({
        TableName: tableName,
        Key: { id },
      })
      .promise();

    if (!result.Item) {
      return createResponse(404, { message: "User not found" });
    }

    return createResponse(200, result.Item);
  } catch (err) {
    return createResponse(500, {
      message: "Failed to get user",
      error: (err as any)?.message,
    });
  }
};
