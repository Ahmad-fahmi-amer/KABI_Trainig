import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/http-status.js";
export default class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}
