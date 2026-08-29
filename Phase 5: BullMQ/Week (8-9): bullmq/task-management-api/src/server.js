import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database.js";
import logger from "./logger/logger.js";
import { connectRedis, disconnectRedis } from "./config/redis.client.js";
import { closeEmailQueue } from "./queues/email.queue.js";
import { registerBackgroundSchedulers } from "./schedulers/background.schedulers.js";
import { closeBackgroundQueue } from "./queues/background.queue.js";

async function bootstrap() {
  try {
    await connectToDatabase();

    await connectRedis();

    await registerBackgroundSchedulers();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    let isShuttingDown = false;

    const shutdown = (signal) => {
      if (isShuttingDown) {
        return;
      }

      isShuttingDown = true;

      logger.info(`${signal} received; shutting down`);

      server.close(async () => {
        try {
          await closeEmailQueue();
          await closeBackgroundQueue();
          await disconnectRedis();
          await disconnectFromDatabase();

          logger.info("Application shutdown completed");

          process.exit(0);
        } catch (error) {
          logger.error(`Application shutdown failed: ${error.message}`);

          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error(`Application startup failed: ${error.message}`);
    process.exit(1);
  }
}

bootstrap();
