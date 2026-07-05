import { logger } from "../../utils/logger/index.js";

export function loggerMiddleware(req, res, next) {
  req.startTime = Date.now();

  logger.info(`[${req.requestId}] ${req.method} ${req.originalUrl} - START`);
  res.on("finish", () => {
    const time = Date.now() - req.startTime;

    logger.info(
      `[${req.requestId}] ${req.method} ${req.originalUrl} ${res.statusCode} ${time}ms - END`,
    );
  });

  next();
}
