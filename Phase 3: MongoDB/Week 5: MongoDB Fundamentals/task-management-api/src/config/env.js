import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "MONGO_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const variable of requiredVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  BOOTSTRAP_ADMIN_FIRST_NAME: process.env.BOOTSTRAP_ADMIN_FIRST_NAME,
  BOOTSTRAP_ADMIN_LAST_NAME: process.env.BOOTSTRAP_ADMIN_LAST_NAME,
  BOOTSTRAP_ADMIN_EMAIL: process.env.BOOTSTRAP_ADMIN_EMAIL,
  BOOTSTRAP_ADMIN_PASSWORD: process.env.BOOTSTRAP_ADMIN_PASSWORD,
  PASSWORD_RESET_EXPIRES_MINUTES: Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES) || 30,
};
