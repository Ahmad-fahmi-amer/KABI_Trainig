import { ForbiddenError, UnauthorizedError } from "../../errors/index.js";

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new UnauthorizedError("Authentication required");
    }

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError("You do not have permission");
    }

    next();
  };
};

export default authorize;
