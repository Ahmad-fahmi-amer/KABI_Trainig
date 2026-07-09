import { NotFoundError } from "../../errors/index.js";

export function notFound(req, res, next) {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
}
