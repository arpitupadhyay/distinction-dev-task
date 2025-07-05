import { APIGatewayProxyHandler } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { v4 as uuidv4 } from "uuid";
import { createResponse } from "../layers/common/nodejs/utils/response";

const db = new DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME!;

export const handler: APIGatewayProxyHandler = async (event) => {
  try {
    const data = JSON.parse(event.body || "{}");

    const user = {
      id: uuidv4(),
      ...data,
    };

    await db
      .put({
        TableName: tableName,
        Item: user,
      })
      .promise();

    return createResponse(201, { message: "User created", id: user.id });
  } catch (err) {
    return createResponse(500, {
      message: "Failed to create user",
      error: (err as any)?.message,
    });
  }
};
