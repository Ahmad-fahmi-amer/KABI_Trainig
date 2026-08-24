import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database.js";
import logger from "./logger/logger.js";
import { connectRedis, disconnectRedis } from "./config/redis.client.js";
import { closeEmailQueue } from "./queues/email.queue.js";

async function bootstrap() {
  try {
    await connectToDatabase();

    await connectRedis();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received; shutting down`);

      server.close(async () => {
        await closeEmailQueue();
        await disconnectRedis();
        await disconnectFromDatabase();
        process.exit(0);
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
