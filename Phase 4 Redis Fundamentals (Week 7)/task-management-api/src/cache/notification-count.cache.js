import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";
import RedisExecutor from "./RedisExecutor.js";

const redisExecutor = new RedisExecutor({ logger, client: redisClient });

function buildKey(userId) {
  return `notification:unread-count:${userId}`;
}

async function get(userId) {
  const normalizedUserId = String(userId);

  return redisExecutor.execute({
    metadata: { namespace: "notification", key: normalizedUserId },
    failureEvent: "notification_count.cache_read_failed",
    fallback: null,
    operation: async () => {
      const cachedCount = await redisClient.get(buildKey(normalizedUserId));

      if (cachedCount === null) {
        logger.debug({
          event: "notification_count.cache_miss",
          userId: normalizedUserId,
        });

        return null;
      }

      logger.debug({
        event: "notification_count.cache_hit",
        userId: normalizedUserId,
      });

      return Number(cachedCount);
    },
  });
}

async function set(userId, count) {
  const normalizedUserId = String(userId);

  return redisExecutor.execute({
    metadata: { namespace: "notification", key: normalizedUserId },
    failureEvent: "notification_count.cache_write_failed",
    fallback: false,
    operation: async () => {
      await redisClient.set(buildKey(normalizedUserId), String(count));
      return true;
    },
  });
}

async function increment(userId) {
  const normalizedUserId = String(userId);
  const key = buildKey(normalizedUserId);
  return redisExecutor.execute({
    metadata: { namespace: "notification", key: normalizedUserId },
    failureEvent: "notification_count.cache_increment_failed",
    fallback: false,
    operation: async () => {
      return redisClient.eval(
        `
        if redis.call("EXISTS", KEYS[1]) == 1 then
          return redis.call("INCR", KEYS[1])
        end

        return nil
      `,
        {
          keys: [key],
          arguments: [],
        },
      );
    },
  });
}

async function decrement(userId) {
  const normalizedUserId = String(userId);
  const key = buildKey(normalizedUserId);

  return redisExecutor.execute({
    metadata: { namespace: "notification", key: normalizedUserId },
    failureEvent: "notification_count.cache_decrement_failed",
    fallback: false,
    operation: async () => {
      return redisClient.eval(
        `
        local current = redis.call("GET", KEYS[1])

        if not current then
          return nil
        end

        if tonumber(current) <= 0 then
          return 0
        end

        return redis.call("DECR", KEYS[1])
      `,
        {
          keys: [key],
          arguments: [],
        },
      );
    },
  });
}

async function reset(userId) {
  const normalizedUserId = String(userId);
  const key = buildKey(normalizedUserId);
  return redisExecutor.execute({
    metadata: { namespace: "notification", key: normalizedUserId },
    failureEvent: "notification_count.cache_reset_failed",
    fallback: false,
    operation: async () => {
      return redisClient.eval(
        `
        if redis.call("EXISTS", KEYS[1]) == 1 then
          redis.call("SET", KEYS[1], "0")
          return 0
        end

        return nil
      `,
        {
          keys: [key],
          arguments: [],
        },
      );
    },
  });
}

export const notificationCounterCache = {
  get,
  set,
  increment,
  decrement,
  reset,
};
