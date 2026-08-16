import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";
import RedisCache from "./RedisCache.js";

const TASK_CACHE_TTL_SECONDS = 300;
const taskCache = new RedisCache({
  client: redisClient,
  logger,
  namespace: "task",
  defaultTtl: TASK_CACHE_TTL_SECONDS,
});

export default taskCache;
