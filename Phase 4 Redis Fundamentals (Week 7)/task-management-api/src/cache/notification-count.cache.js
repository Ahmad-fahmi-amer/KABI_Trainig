import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";

function buildKey(userId) {
  return `notification:unread-count:${userId}`;
}

async function get(userId) {
  if (!redisClient.isReady) {
    return null;
  }

  const normalizedUserId = String(userId);

  try {
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
  } catch (error) {
    logger.warn({
      event: "notification_count.cache_read_failed",
      userId: normalizedUserId,
      message: error.message,
    });

    return null;
  }
}

async function set(userId, count) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedUserId = String(userId);

  try {
    await redisClient.set(buildKey(normalizedUserId), String(count));
  } catch (error) {
    logger.warn({
      event: "notification_count.cache_write_failed",
      userId: normalizedUserId,
      message: error.message,
    });
  }
}

async function increment(userId) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedUserId = String(userId);
  const key = buildKey(normalizedUserId);

  try {
    return await redisClient.eval(
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
  } catch (error) {
    logger.warn({
      event: "notification_count.increment_failed",
      userId: normalizedUserId,
      message: error.message,
    });
  }
}

async function decrement(userId) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedUserId = String(userId);
  const key = buildKey(normalizedUserId);

  try {
    return await redisClient.eval(
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
  } catch (error) {
    logger.warn({
      event: "notification_count.decrement_failed",
      userId: normalizedUserId,
      message: error.message,
    });
  }
}

async function reset(userId) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedUserId = String(userId);
  const key = buildKey(normalizedUserId);

  try {
    return await redisClient.eval(
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
  } catch (error) {
    logger.warn({
      event: "notification_count.reset_failed",
      userId: normalizedUserId,
      message: error.message,
    });
  }
}
export const notificationCounterCache = {
  get,
  set,
  increment,
  decrement,
  reset,
};
