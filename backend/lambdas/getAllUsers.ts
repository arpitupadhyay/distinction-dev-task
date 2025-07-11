import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { createResponse } from "../layers/common/nodejs/utils/response";

const db = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  const origin = event.headers.origin || "";

  try {
    const result = await db.scan({ TableName: tableName }).promise();
    return createResponse(200, result.Items, origin);
  } catch (err) {
    return createResponse(
      500,
      {
        message: "Failed to get users",
        error: (err as any)?.message,
      },
      origin
    );
  }
};
