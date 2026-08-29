import logger from "../logger/logger.js";

const REDIS_FAILURE_EXIT_DELAY_MS = 30_000;
const SHUTDOWN_TIMEOUT_MS = 5_000;

function isRedisConnectionError(error) {
  return (
    ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(
      error?.code,
    ) || /redis|socket|connection|connect/i.test(error?.message ?? "")
  );
}

export function setupWorkerLifecycle({ worker, workerName, cleanup }) {
  let isShuttingDown = false;
  let redisFailureTimer = null;
  let forceExitTimer = null;

  function clearRedisFailureExit() {
    if (!redisFailureTimer) {
      return;
    }

    clearTimeout(redisFailureTimer);
    redisFailureTimer = null;
  }

  async function closeWorkerSafely(timeoutMs = SHUTDOWN_TIMEOUT_MS) {
    let timeout;

    try {
      await Promise.race([
        worker.close(),

        new Promise((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error("Worker graceful shutdown timed out")),
            timeoutMs,
          );
        }),
      ]);
    } catch (error) {
      logger.warn(`${workerName} graceful close failed; forcing close`, {
        errorName: error.name,
        errorMessage: error.message,
      });

      void worker.close(true).catch((forceError) => {
        logger.error(`${workerName} forced close failed`, {
          errorName: forceError.name,
          errorMessage: forceError.message,
        });
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  async function shutdown(signal, exitCode = 0) {
    if (isShuttingDown) {
      logger.warn(
        `${workerName} received a second shutdown signal; forcing exit`,
        {
          signal,
        },
      );

      process.exit(exitCode || 1);
    }

    isShuttingDown = true;
    clearRedisFailureExit();

    logger.info(`${workerName} shutting down`, {
      signal,
    });

    forceExitTimer = setTimeout(() => {
      logger.error(`${workerName} shutdown timed out; forcing process exit`, {
        signal,
      });

      process.exit(exitCode || 1);
    }, SHUTDOWN_TIMEOUT_MS + 1_000);

    try {
      await closeWorkerSafely();

      if (cleanup) {
        await cleanup();
      }

      logger.info(`${workerName} shutdown completed`);

      clearTimeout(forceExitTimer);
      process.exit(exitCode);
    } catch (error) {
      logger.error(`${workerName} shutdown failed`, {
        errorName: error.name,
        errorMessage: error.message,
      });

      clearTimeout(forceExitTimer);
      process.exit(1);
    }
  }

  function scheduleRedisFailureExit() {
    if (redisFailureTimer || isShuttingDown) {
      return;
    }

    logger.warn(
      `${workerName} lost Redis connection; scheduling process recycle`,
      {
        delayMs: REDIS_FAILURE_EXIT_DELAY_MS,
      },
    );

    redisFailureTimer = setTimeout(() => {
      logger.error(
        `${workerName} Redis connection did not remain reliable; recycling process`,
      );

      void shutdown("REDIS_CONNECTION_FAILURE", 1);
    }, REDIS_FAILURE_EXIT_DELAY_MS);
  }

  worker.on("ready", () => {
    logger.info(`${workerName} Redis connection ready`);
  });

  worker.on("closed", () => {
    logger.info(`${workerName} closed`);
  });

  worker.on("error", (error) => {
    logger.error(`${workerName} error`, {
      errorName: error.name,
      errorMessage: error.message,
    });

    if (isRedisConnectionError(error)) {
      scheduleRedisFailureExit();
    }
  });

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  return {
    shutdown,
    closeWorkerSafely,
  };
}
