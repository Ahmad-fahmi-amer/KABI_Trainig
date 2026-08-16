import HTTP_STATUS from "../constants/http-status.js";
import AppError from "./AppError.js";

export default class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code = "FORBIDDEN") {
    super(message, HTTP_STATUS.FORBIDDEN, code);
  }
}
