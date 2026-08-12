import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";

const USER_AUTH_CACHE_TTL_SECONDS = 300;

function buildKey(userId) {
  return `user-auth:${userId}`;
}

function serializeUser(user) {
  return JSON.stringify({
    _id: String(user._id),
    role: user.role,
    status: user.status,
    teamId: user.teamId ? String(user.teamId) : null,
  });
}

async function get(userId) {
  if (!redisClient.isReady) {
    return null;
  }

  const normalizedUserId = String(userId);

  try {
    const cachedUser = await redisClient.get(buildKey(normalizedUserId));

    if (!cachedUser) {
      logger.debug({
        event: "user_auth.cache_miss",
        userId: normalizedUserId,
      });

      return null;
    }

    logger.debug({
      event: "user_auth.cache_hit",
      userId: normalizedUserId,
    });

    return JSON.parse(cachedUser);
  } catch (error) {
    logger.warn({
      event: "user_auth.cache_read_failed",
      userId: normalizedUserId,
      message: error.message,
    });

    return null;
  }
}

async function set(user) {
  if (!redisClient.isReady) {
    return;
  }

  const userId = String(user._id);

  try {
    await redisClient.set(buildKey(userId), serializeUser(user), {
      EX: USER_AUTH_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    logger.warn({
      event: "user_auth.cache_write_failed",
      userId,
      message: error.message,
    });
  }
}

async function invalidate(userId) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedUserId = String(userId);

  try {
    await redisClient.del(buildKey(normalizedUserId));
  } catch (error) {
    logger.warn({
      event: "user_auth.cache_invalidation_failed",
      userId: normalizedUserId,
      message: error.message,
    });
  }
}

const userAuthCache = {
  get,
  set,
  invalidate,
};

export default userAuthCache;
