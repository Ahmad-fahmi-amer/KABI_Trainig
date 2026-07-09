import AppError from "./AppError.js";
import HTTP_STATUS from "../constants/http-status.js";
export default class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}
