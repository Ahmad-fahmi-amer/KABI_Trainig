import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";
import RedisCache from "./RedisCache.js";

const USER_AUTH_CACHE_TTL_SECONDS = 300;
function serializer({ _id, status, teamId, role }) {
  return JSON.stringify({
    _id: String(_id),
    status,
    teamId: teamId ? String(teamId) : null,
    role,
  });
}
const userAuthCache = new RedisCache({
  client: redisClient,
  logger,
  namespace: "user-auth",
  defaultTtl: USER_AUTH_CACHE_TTL_SECONDS,
  serializer,
});

export default userAuthCache;
