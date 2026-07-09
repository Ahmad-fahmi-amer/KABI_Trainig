export function requestMiddlewareId(req, res, next) {
  req.requestId = crypto.randomUUID();

  next();
}
