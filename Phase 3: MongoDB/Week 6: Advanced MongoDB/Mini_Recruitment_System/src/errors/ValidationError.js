import HTTP_STATUS from "../constants/http-status.js";
import AppError from "./AppError.js";

export default class ValidationError extends AppError {
  constructor(details = []) {
    super(
      "Invalid request data",
      HTTP_STATUS.BAD_REQUEST,
      "VALIDATION_ERROR",
      details,
    );
  }
}
