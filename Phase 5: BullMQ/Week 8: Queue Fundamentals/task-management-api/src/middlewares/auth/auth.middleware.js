import tokenService from "../../api/v1/modules/auth/token.service.js";
import userService from "../../api/v1/modules/users/user.service.js";
import UnauthorizedError from "../../errors/UnauthorizedError.js";
import USER_STATUS from "../../constants/user-status.js";
import userAuthCache from "../../cache/user-auth.cache.js";
async function protect(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("authentication required");
  }

  const token = authHeader.split(" ")[1];

  const payload = tokenService.verifyAccessToken(token);

  let user = await userAuthCache.get(payload.sub);
  if (!user) {
    user = await userService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedError("user no longer exists");
    }
    if (user.status !== USER_STATUS.ACTIVE) {
      throw new UnauthorizedError("user is inactive");
    }
    const { _id, status, role, teamId } = user;

    const authUser = {
      _id,
      status,
      role,
      teamId,
    };

    await userAuthCache.set(_id, authUser);
  }

  req.user = user;
  next();
}

export default protect;
