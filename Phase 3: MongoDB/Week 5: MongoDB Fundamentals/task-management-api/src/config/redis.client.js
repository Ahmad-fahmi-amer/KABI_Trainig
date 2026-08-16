import { createClient } from "redis";
import { env } from "./env";
import logger from "../logger/logger";

const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (err) => {
  logger.error({
    event: "redis.error",
    errorName: err.name,
    message: err.message,
    stack: err.stack,
  });
});

redisClient.on("ready", () => {
  logger.info({
    event: "redis.ready",
    message: "Redis client is ready",
  });
});

redisClient.on("reconnecting", () => {
  logger.warn({
    event: "redis.reconnecting",
    message: "Redis client is reconnecting",
  });
});

redisClient.on("end", () => {
  logger.info({
    event: "redis.end",
    message: "Redis connection closed",
  });
});

export async function connectRedis() {
  if (!env.REDIS_URL) {
    logger.warn({
      event: "redis.disabled",
      message: "REDIS_URL is not configured; Redis is disabled",
    });

    return false;
  }

  try {
    await redisClient.connect();

    logger.info({
      event: "redis.connected",
      message: "Redis connected successfully",
    });

    return true;
  } catch (error) {
    logger.error({
      event: "redis.connection_failed",
      message: error.message,
      stack: error.stack,
    });

    return false;
  }
}
