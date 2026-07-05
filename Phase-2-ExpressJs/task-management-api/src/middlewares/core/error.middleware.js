import { logger } from "../../utils/logger/index.js";

export function errorHandler(err, req, res, next) {
  logger.error(
    `${req.requestId} - ${req.method} - ${req.url} - ${err.message}`,
  );

  const statusCode = err.statusCode || 500;
  console.log(err);

  res.status(statusCode).json({
    success: false,
    // message: err.isOperational ? err.message : "Internal Server Error",
    message: err.message,
  });
}
