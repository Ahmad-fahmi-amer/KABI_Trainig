import ValidationError from "../../errors/ValidationError.js";
import tokenService from "../../api/v1/modules/auth/token.service.js";
import userService from "../../api/v1/modules/users/user.service.js";
import UnauthorizedError from "../../errors/UnauthorizedError.js";
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("authentication required");
  }

  const token = authHeader.split(" ")[1];

  const payload = tokenService.verifyAccessToken(token);

  const user = await userService.findUserById(payload.id);

  if (!user) {
    throw new UnauthorizedError("user no longer exists");
  }
  req.user = user;
  next();
}

export default protect;
