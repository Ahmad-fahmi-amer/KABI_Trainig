import AppError from "../../errors/AppError.js";
import HTTP_STATUS from "../../constants/http-status.js";
import logger from "../../logger/logger.js";

export function errorHandler(err, req, res, next) {
  if (err?.code === 11000) {
    err = new AppError(`Duplicate value for ${Object.keys(err.keyPattern ?? {}).join(", ")}`, HTTP_STATUS.CONFLICT);
  } else if (err?.name === "CastError") {
    err = new AppError("Invalid resource identifier", HTTP_STATUS.BAD_REQUEST);
  } else if (err?.name === "ValidationError" && !err.isOperational) {
    const mapped = Object.values(err.errors).map((item) => ({ field: item.path, message: item.message }));
    const validationError = new AppError("validation failed", HTTP_STATUS.BAD_REQUEST);
    validationError.errors = mapped;
    err = validationError;
  }
  const isOperational = err.isOperational;

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
