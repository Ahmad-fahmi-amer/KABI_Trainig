import logger from "../../logger/logger.js";

export function loggerMiddleware(req, res, next) {
  req.startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - req.startTime;
    logger.info({
      event: "HTTP_REQUEST",

      requestId: req.requestId,

      method: req.method,

      path: req.originalUrl,

      statusCode: res.statusCode,

      duration,
    });
  });

  next();
}
