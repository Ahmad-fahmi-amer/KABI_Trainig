import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";

function buildSessionKey(sessionId) {
  return `session:${sessionId}`;
}

function buildUserSessionsKey(userId) {
  return `sessions:user:${userId}`;
}

function serializeSession(session) {
  return JSON.stringify({
    _id: String(session._id),
    userId: String(session.userId),
    refreshTokenHash: session.refreshTokenHash,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt ?? null,
    replacedBySessionId: session.replacedBySessionId
      ? String(session.replacedBySessionId)
      : null,
  });
}

function deserializeSession(value) {
  const session = JSON.parse(value);

  return {
    ...session,
    expiresAt: new Date(session.expiresAt),
    revokedAt: session.revokedAt ? new Date(session.revokedAt) : null,
  };
}

async function get(sessionId) {
  if (!redisClient.isReady) {
    return null;
  }

  const normalizedSessionId = String(sessionId);

  try {
    const cachedSession = await redisClient.get(
      buildSessionKey(normalizedSessionId),
    );

    if (!cachedSession) {
      logger.debug({
        event: "session.cache_miss",
        sessionId: normalizedSessionId,
      });

      return null;
    }

    logger.debug({
      event: "session.cache_hit",
      sessionId: normalizedSessionId,
    });

    return deserializeSession(cachedSession);
  } catch (error) {
    logger.warn({
      event: "session.cache_read_failed",
      sessionId: normalizedSessionId,
      message: error.message,
    });

    return null;
  }
}

async function set(session) {
  if (!redisClient.isReady) {
    return;
  }

  const sessionId = String(session._id);
  const userId = String(session.userId);

  const ttlSeconds = Math.floor(
    (new Date(session.expiresAt).getTime() - Date.now()) / 1000,
  );

  if (ttlSeconds <= 0) {
    return;
  }

  const sessionKey = buildSessionKey(sessionId);
  const userSessionsKey = buildUserSessionsKey(userId);

  try {
    const currentUserSessionsTtl = await redisClient.ttl(userSessionsKey);

    const userSessionsTtl = Math.max(currentUserSessionsTtl, ttlSeconds);

    await redisClient
      .multi()
      .set(sessionKey, serializeSession(session), {
        EX: ttlSeconds,
      })
      .sAdd(userSessionsKey, sessionId)
      .expire(userSessionsKey, userSessionsTtl)
      .exec();
  } catch (error) {
    logger.warn({
      event: "session.cache_write_failed",
      sessionId,
      userId,
      message: error.message,
    });
  }
}

async function invalidate(sessionId, userId) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedSessionId = String(sessionId);
  const normalizedUserId = String(userId);

  try {
    await redisClient
      .multi()
      .del(buildSessionKey(normalizedSessionId))
      .sRem(buildUserSessionsKey(normalizedUserId), normalizedSessionId)
      .exec();
  } catch (error) {
    logger.warn({
      event: "session.cache_invalidation_failed",
      sessionId: normalizedSessionId,
      userId: normalizedUserId,
      message: error.message,
    });
  }
}

async function invalidateAllForUser(userId) {
  if (!redisClient.isReady) {
    return;
  }

  const normalizedUserId = String(userId);
  const userSessionsKey = buildUserSessionsKey(normalizedUserId);

  try {
    const sessionIds = await redisClient.sMembers(userSessionsKey);

    const transaction = redisClient.multi();

    for (const sessionId of sessionIds) {
      transaction.del(buildSessionKey(sessionId));
    }

    transaction.del(userSessionsKey);

    await transaction.exec();
  } catch (error) {
    logger.warn({
      event: "session.cache_user_invalidation_failed",
      userId: normalizedUserId,
      message: error.message,
    });
  }
}

const sessionCache = {
  get,
  set,
  invalidate,
  invalidateAllForUser,
};

export default sessionCache;
