import AppError from "../../errors/AppError.js";
import HTTP_STATUS from "../../constants/http-status.js";
import logger from "../../logger/logger.js";

export function errorHandler(err, req, res, next) {
  const isOperational = err instanceof AppError;

  const statusCode = isOperational
    ? err.statusCode
    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  if (!isOperational) {
    logger.error({
      event: err.name,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message: err.message,
      stack: err.stack,
    });
  } else {
    logger.warn({
      event: err.name,
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode,
      message: err.message,
    });
  }

  const response = {
    success: false,
    message: isOperational ? err.message : "Internal server error",
  };

  if (Array.isArray(err.errors) && err.errors.length > 0) {
    response.errors = err.errors;
  }

  return res.status(statusCode).json(response);
}
