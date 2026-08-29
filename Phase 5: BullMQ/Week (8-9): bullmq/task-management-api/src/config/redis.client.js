import { createClient } from "redis";
import { env } from "./env.js";
import logger from "../logger/logger.js";

let hasConnectedOnce = false;

const redisClient = createClient({
  url: env.REDIS_URL,

  socket: {
    connectTimeout: 5000,

    reconnectStrategy: (retries) => {
      if (!hasConnectedOnce) {
        return false;
      }

      const jitter = Math.floor(Math.random() * 200);
      const delay = Math.min(2 ** retries * 50, 2000);

      return delay + jitter;
    },
  },
});

redisClient.on("ready", () => {
  hasConnectedOnce = true;

  logger.info({
    event: "redis.ready",
    message: "Redis client is ready",
  });
});

redisClient.on("error", (error) => {
  logger.error({
    event: "redis.error",
    errorName: error.name,
    message: error.message,
    stack: error.stack,
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
  if (redisClient.isReady) {
    return;
  }

  try {
    await redisClient.connect();

    logger.info({
      event: "redis.connected",
      message: "Redis connected successfully",
    });
  } catch (error) {
    logger.error({
      event: "redis.connection_failed",
      message: "Failed to connect to Redis during application startup",
      errorName: error.name,
      errorMessage: error.message,
      stack: error.stack,
    });

    throw error;
  }
}

export async function disconnectRedis() {
  if (!redisClient.isOpen) {
    return;
  }

  await redisClient.close();

  logger.info({
    event: "redis.disconnected",
    message: "Redis disconnected successfully",
  });
}

export default redisClient;
