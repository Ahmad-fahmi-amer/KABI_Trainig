import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/http-status.js";

export default class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
