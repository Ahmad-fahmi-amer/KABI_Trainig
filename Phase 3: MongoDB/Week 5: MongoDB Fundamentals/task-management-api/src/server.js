import app from "./app.js";
import { env } from "./config/env.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database.js";
import logger from "./logger/logger.js";

async function bootstrap() {
  try {
    await connectToDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received; shutting down`);

      server.close(async () => {
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
