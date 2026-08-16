import app from "./app.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "./config/database.js";
import { env } from "./config/env.js";
import logger from "./logger/logger.js";

async function bootstrap() {
  try {
    await connectToDatabase();

    const server = app.listen(env.PORT, () => {
      logger.info({
        event: "SERVER_STARTED",
        port: env.PORT,
        environment: env.NODE_ENV,
      });
    });

    let shuttingDown = false;

    const shutdown = async (signal) => {
      if (shuttingDown) return;
      shuttingDown = true;

      logger.info({ event: "SHUTDOWN_STARTED", signal });

      server.close(async (serverError) => {
        try {
          if (serverError) throw serverError;
          await disconnectFromDatabase();
          logger.info({ event: "SHUTDOWN_COMPLETED", signal });
          process.exit(0);
        } catch (error) {
          logger.error({
            event: "SHUTDOWN_FAILED",
            signal,
            message: error.message,
            stack: error.stack,
          });
          process.exit(1);
        }
      });
    };

    process.once("SIGINT", () => shutdown("SIGINT"));
    process.once("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    logger.error({
      event: "APPLICATION_STARTUP_FAILED",
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
}

bootstrap();
