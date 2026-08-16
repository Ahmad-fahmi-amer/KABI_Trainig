import HTTP_STATUS from "../../constants/http-status.js";
import AppError from "../../errors/AppError.js";
import logger from "../../logger/logger.js";

function normalizeError(error) {
  if (error?.code === 11000) {
    const fields = Object.keys(error.keyPattern ?? {});
    return new AppError(
      `Duplicate value for ${fields.join(", ") || "unique field"}`,
      HTTP_STATUS.CONFLICT,
      "DUPLICATE_RESOURCE",
    );
  }

  if (error?.name === "CastError") {
    return new AppError(
      "Invalid resource identifier",
      HTTP_STATUS.BAD_REQUEST,
      "INVALID_RESOURCE_ID",
    );
  }

  if (error?.name === "ValidationError" && !error.isOperational) {
    const details = Object.values(error.errors ?? {}).map((item) => ({
      field: item.path,
      message: item.message,
    }));

    return new AppError(
      "Invalid request data",
      HTTP_STATUS.BAD_REQUEST,
      "VALIDATION_ERROR",
      details,
    );
  }

  return error;
}

export function errorHandler(error, req, res, _next) {
  const normalizedError = normalizeError(error);
  const isOperational = normalizedError?.isOperational === true;
  const statusCode = isOperational
    ? normalizedError.statusCode
    : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const logContext = {
    event: normalizedError?.name ?? "Error",
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: normalizedError?.message,
  };

  if (isOperational) {
    logger.warn(logContext);
  } else {
    logger.error({ ...logContext, stack: normalizedError?.stack });
  }

  const response = {
    success: false,
    error: {
      code: isOperational ? normalizedError.code : "INTERNAL_SERVER_ERROR",
      message: isOperational
        ? normalizedError.message
        : "Internal server error",
    },
  };

  if (isOperational && normalizedError.details !== undefined) {
    response.error.details = normalizedError.details;
  }

  return res.status(statusCode).json(response);
}
