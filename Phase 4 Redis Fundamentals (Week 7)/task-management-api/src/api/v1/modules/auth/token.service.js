import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { auth } from "../../../../config/auth.js";
import UnauthorizedError from "../../../../errors/UnauthorizedError.js";

function verify(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}

function generateTokenPair(user) {
  const sessionId = new mongoose.Types.ObjectId();
  const payload = { sub: String(user._id), role: user.role };
  const accessToken = jwt.sign(payload, auth.JWT_ACCESS_SECRET, {
    expiresIn: auth.JWT_ACCESS_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ ...payload, sid: String(sessionId) }, auth.JWT_REFRESH_SECRET, {
    expiresIn: auth.JWT_REFRESH_EXPIRES_IN,
  });
  const decoded = jwt.decode(refreshToken);
  return {
    accessToken,
    refreshToken,
    sessionId,
    expiresAt: new Date(decoded.exp * 1000),
    refreshTokenHash: crypto.createHash("sha256").update(refreshToken).digest("hex"),
  };
}

export default {
  generateTokenPair,
  hashRefreshToken(token) {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
  verifyAccessToken(token) {
    return verify(token, auth.JWT_ACCESS_SECRET);
  },
  verifyRefreshToken(token) {
    return verify(token, auth.JWT_REFRESH_SECRET);
  },
};
