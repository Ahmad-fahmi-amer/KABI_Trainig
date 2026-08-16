import dotenv from "dotenv";

dotenv.config();

const requiredVariables = ["MONGO_URI"];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

const port = Number(process.env.PORT ?? 3000);

if (!Number.isInteger(port) || port <= 0 || port > 65535) {
  throw new Error("PORT must be a valid integer between 1 and 65535");
}

export const env = Object.freeze({
  PORT: port,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  MONGO_URI: process.env.MONGO_URI,
});
