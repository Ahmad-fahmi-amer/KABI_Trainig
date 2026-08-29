import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/http-status.js";
export default class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, HTTP_STATUS.CONFLICT);
  }
}
