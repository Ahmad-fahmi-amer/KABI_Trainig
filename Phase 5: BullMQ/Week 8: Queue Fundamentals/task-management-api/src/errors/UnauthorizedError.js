import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/http-status.js";

export default class UnauthorizedError extends AppError {
  constructor(message = "unauthorized") {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}
