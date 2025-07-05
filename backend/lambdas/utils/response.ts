export const createResponse = (
  statusCode: number,
  body: any = {},
  headers: Record<string, string> = {}
) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "http://localhost:3000", // CORS
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    ...headers,
  },
  body: JSON.stringify(body),
});
