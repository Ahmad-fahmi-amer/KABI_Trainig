import redisClient from "../config/redis.client.js";
import logger from "../logger/logger.js";

const TASK_CACHE_TTL_SECONDS = 60;

function buildKey(taskId) {
  return `task:${taskId}`;
}

async function get(taskId) {
  if (!redisClient.isReady) {
    return null;
  }

  const key = buildKey(taskId);

  try {
    const cachedTask = await redisClient.get(key);

    if (!cachedTask) {
      logger.debug({
        event: "task.cache_miss",
        taskId: String(taskId),
      });

      return null;
    }

    logger.debug({
      event: "task.cache_hit",
      taskId: String(taskId),
    });

    return JSON.parse(cachedTask);
  } catch (error) {
    logger.warn({
      event: "task.cache_read_failed",
      taskId: String(taskId),
      message: error.message,
    });

    return null;
  }
}
async function set(task) {
  if (!redisClient.isReady) {
    return;
  }

  const key = buildKey(task._id);

  try {
    await redisClient.set(key, JSON.stringify(task), {
      EX: TASK_CACHE_TTL_SECONDS,
    });
  } catch (error) {
    logger.warn({
      event: "task.cache_write_failed",
      taskId: String(task._id),
      message: error.message,
    });
  }
}
async function invalidate(taskId) {
  if (!redisClient.isReady) {
    return;
  }

  try {
    await redisClient.del(buildKey(taskId));
  } catch (error) {
    logger.warn({
      event: "task.cache_invalidation_failed",
      taskId: String(taskId),
      message: error.message,
    });
  }
}
const taskCache = {
  get,
  set,
  invalidate,
};

export default taskCache;
