import HTTP_STATUS from "../constants/http-status.js";
import AppError from "./AppError.js";

export default class ConflictError extends AppError {
  constructor(message = "Conflict", code = "CONFLICT") {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}
