import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/http-status.js";

export default class ValidationError extends AppError {
  constructor(errors = []) {
    super("validation failed", HTTP_STATUS.BAD_REQUEST);
    this.errors = errors;
  }
}
