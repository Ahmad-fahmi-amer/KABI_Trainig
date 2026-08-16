import HTTP_STATUS from "../constants/http-status.js";
import AppError from "./AppError.js";

export default class NotFoundError extends AppError {
  constructor(message = "Resource not found", code = "RESOURCE_NOT_FOUND") {
    super(message, HTTP_STATUS.NOT_FOUND, code);
  }
}
