import { auth } from "../../../../config/auth.js";
import jwt from "jsonwebtoken";
import UnauthorizedError from "../../../../errors/UnauthorizedError.js";
class TokenService {
  generateAccessToken(payload) {
    return jwt.sign(payload, auth.JWT_ACCESS_SECRET, {
      expiresIn: auth.JWT_ACCESS_EXPIRES_IN,
    });
  }

  generateRefreshToken(payload) {
    return jwt.sign(payload, auth.JWT_REFRESH_SECRET, {
      expiresIn: auth.JWT_REFRESH_EXPIRES_IN,
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, auth.JWT_ACCESS_SECRET);
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }

  verifyRefreshToken(token) {
    return jwt.verify(token, auth.JWT_REFRESH_SECRET);
  }
}

export default new TokenService();
