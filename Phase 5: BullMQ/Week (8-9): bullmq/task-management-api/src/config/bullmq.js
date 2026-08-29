// bullmq.js

import { env } from "./env.js";

export function getBullMQConnection() {
  const redisUrl = new URL(env.REDIS_URL);

  return {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
  };
}
