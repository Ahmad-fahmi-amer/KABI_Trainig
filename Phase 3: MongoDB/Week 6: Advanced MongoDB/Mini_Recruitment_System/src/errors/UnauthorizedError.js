import HTTP_STATUS from "../constants/http-status.js";
import AppError from "./AppError.js";

export default class UnauthorizedError extends AppError {
  constructor(message = "Authentication required", code = "UNAUTHORIZED") {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}
