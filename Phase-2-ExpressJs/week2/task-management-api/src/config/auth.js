import dotenv from "dotenv";

dotenv.config();

export const auth = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "123456",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "789456",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || 300000,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || 1000000,
};
