export const createResponse = (
  statusCode: number,
  body: any = {},
  origin: string = "",
  headers: Record<string, string> = {}
) => {
  const allowedOrigins = [
    "https://distinction-dev-task.vercel.app",
    "http://localhost:3000",
  ];

  const corsOrigin = allowedOrigins.includes(origin) ? origin : "";

  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": corsOrigin,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      ...headers,
    },
    body: JSON.stringify(body),
  };
};
