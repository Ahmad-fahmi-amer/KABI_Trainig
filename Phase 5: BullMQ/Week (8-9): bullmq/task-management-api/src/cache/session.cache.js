import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";
import RedisExecutor from "./RedisExecutor.js";

const redisExecutor = new RedisExecutor({ logger, client: redisClient });

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

function buildUserSessionsKey(userId) {
  return `sessions:user:${userId}`;
}

function buildSessionKey(sessionId) {
  return `session:${sessionId}`;
}

async function get(sessionId) {
  const normalizedSessionId = String(sessionId);
  const key = buildSessionKey(normalizedSessionId);
  return redisExecutor.execute({
    metadata: { namespace: "session", key: normalizedSessionId },
    failureEvent: "session.cache_read_failed",
    fallback: null,
    operation: async () => {
      const cachedSession = await redisClient.get(key);

      if (cachedSession === null) {
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
    },
  });
}

async function set(session) {
  const normalizedSessionId = String(session._id);
  const normalizedUserId = String(session.userId);

  const sessionKey = buildSessionKey(normalizedSessionId);
  const userSessionsKey = buildUserSessionsKey(normalizedUserId);

  const ttlSeconds = Math.floor(
    (new Date(session.expiresAt).getTime() - Date.now()) / 1000,
  );

  if (ttlSeconds <= 0) {
    return;
  }
  return redisExecutor.execute({
    metadata: { namespace: "session", key: normalizedSessionId },
    failureEvent: "session.cache_write_failed",
    fallback: false,
    operation: async () => {
      const currentUserSessionsTtl = await redisClient.ttl(userSessionsKey);

      const userSessionsTtl = Math.max(currentUserSessionsTtl, ttlSeconds);

      await redisClient
        .multi()
        .set(sessionKey, serializeSession(session), {
          EX: ttlSeconds,
        })
        .sAdd(userSessionsKey, normalizedSessionId)
        .expire(userSessionsKey, userSessionsTtl)
        .exec();
    },
  });
}

async function del(sessionId, userId) {
  const normalizedSessionId = String(sessionId);
  const normalizedUserId = String(userId);

  const sessionKey = buildSessionKey(normalizedSessionId);
  const userSessionsKey = buildUserSessionsKey(normalizedUserId);

  return redisExecutor.execute({
    metadata: { namespace: "session", key: normalizedSessionId },
    failureEvent: "session.cache_invalidation_failed",
    fallback: false,
    operation: async () => {
      await redisClient
        .multi()
        .del(buildSessionKey(normalizedSessionId))
        .sRem(buildUserSessionsKey(normalizedUserId), normalizedSessionId)
        .exec();
    },
  });
}

async function invalidateAllForUser(userId) {
  const normalizedUserId = String(userId);

  const userSessionsKey = buildUserSessionsKey(normalizedUserId);

  return redisExecutor.execute({
    metadata: { namespace: "user:sessions", key: normalizedUserId },
    failureEvent: "session.cache_user_invalidation_failed",
    fallback: false,
    operation: async () => {
      const sessionIds = await redisClient.sMembers(userSessionsKey);

      const transaction = redisClient.multi();

      for (const sessionId of sessionIds) {
        transaction.del(buildSessionKey(sessionId));
      }

      transaction.del(userSessionsKey);

      await transaction.exec();
    },
  });
}

const sessionCache = {
  get,
  set,
  del,
  invalidateAllForUser,
};

export default sessionCache;
