import HTTP_STATUS from "../constants/http-status.js";
import AppError from "./AppError.js";

export default class BadRequestError extends AppError {
  constructor(message = "Bad request", code = "BAD_REQUEST", details) {
    super(message, HTTP_STATUS.BAD_REQUEST, code, details);
  }
}
