import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { ForbiddenError, UnauthorizedError } from "../../../../errors/index.js";
import USER_STATUS from "../../../../constants/user-status.js";
import {
  ACTIVITY_ACTION,
  ACTIVITY_ENTITY_TYPE,
} from "../../../../constants/activity.js";
import { runInTransaction } from "../../../../database/unit-of-work.js";
import activityRepository from "../activity-logs/activity-log.repository.js";
import authSessionRepository from "../auth-sessions/auth-session.repository.js";
import userRepository from "../users/user.repository.js";
import passwordResetRepository from "../password-reset-tokens/password-reset-token.repository.js";
import tokenService from "./token.service.js";

async function login({ email, password }, context = {}) {
  const user = await userRepository.findAuthUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new UnauthorizedError("Invalid email or password");
  }
  if (user.status !== USER_STATUS.ACTIVE)
    throw new ForbiddenError("User is inactive");
  const tokens = tokenService.generateTokenPair(user);
  await runInTransaction(async (session) => {
    await authSessionRepository.createSession(
      {
        _id: tokens.sessionId,
        userId: user._id,
        refreshTokenHash: tokens.refreshTokenHash,
        expiresAt: tokens.expiresAt,
        ipAddress: context.ip,
        userAgent: context.userAgent,
      },
      session,
    );
    await userRepository.updateLastLogin(user._id, new Date(), session);
    await activityRepository.appendActivityLog(
      {
        actorId: user._id,
        entityType: ACTIVITY_ENTITY_TYPE.AUTH_SESSION,
        entityId: tokens.sessionId,
        action: ACTIVITY_ACTION.LOGIN_SUCCEEDED,
        requestId: context.requestId,
        ipAddress: context.ip,
      },
      session,
    );
  });
  delete user.passwordHash;
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user,
  };
}

async function refresh(refreshToken, context = {}) {
  const payload = tokenService.verifyRefreshToken(refreshToken);
  const oldSession = await authSessionRepository.findByRefreshTokenHash(
    tokenService.hashRefreshToken(refreshToken),
  );
  if (oldSession?.revokedAt) {
    await authSessionRepository.revokeAllForUser(oldSession.userId);
    throw new UnauthorizedError(
      "Refresh token reuse detected; all sessions were revoked",
    );
  }
  if (!oldSession || oldSession.expiresAt <= new Date()) {
    throw new UnauthorizedError("Refresh token is invalid or revoked");
  }
  if (
    String(oldSession._id) !== payload.sid ||
    String(oldSession.userId) !== payload.sub
  ) {
    throw new UnauthorizedError("Refresh token session does not match");
  }

  const user = await userRepository.findUserById(payload.sub);
  if (!user || user.status !== USER_STATUS.ACTIVE)
    throw new UnauthorizedError("User is unavailable");
  const tokens = tokenService.generateTokenPair(user);

  await runInTransaction(async (session) => {
    const rotated = await authSessionRepository.rotateSession(
      oldSession._id,
      tokens.sessionId,
      session,
    );
    if (!rotated) throw new UnauthorizedError("Refresh token was already used");
    await authSessionRepository.createSession(
      {
        _id: tokens.sessionId,
        userId: user._id,
        refreshTokenHash: tokens.refreshTokenHash,
        expiresAt: tokens.expiresAt,
        ipAddress: context.ip,
        userAgent: context.userAgent,
      },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: user._id,
        entityType: ACTIVITY_ENTITY_TYPE.AUTH_SESSION,
        entityId: tokens.sessionId,
        action: ACTIVITY_ACTION.TOKEN_REFRESHED,
        requestId: context.requestId,
        ipAddress: context.ip,
      },
      session,
    );
  });
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user,
  };
}

async function logout(refreshToken, context = {}) {
  const payload = tokenService.verifyRefreshToken(refreshToken);
  const authSession = await authSessionRepository.findByRefreshTokenHash(
    tokenService.hashRefreshToken(refreshToken),
  );
  if (
    authSession &&
    !authSession.revokedAt &&
    String(authSession._id) === payload.sid
  ) {
    await runInTransaction(async (session) => {
      await authSessionRepository.revokeSession(authSession._id, session);
      await activityRepository.appendActivityLog(
        {
          actorId: authSession.userId,
          entityType: ACTIVITY_ENTITY_TYPE.AUTH_SESSION,
          entityId: authSession._id,
          action: ACTIVITY_ACTION.LOGOUT,
          requestId: context.requestId,
          ipAddress: context.ip,
        },
        session,
      );
    });
  }
}

async function confirmPasswordReset(token, newPassword) {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const reset = await passwordResetRepository.findValidByHash(tokenHash);
  if (!reset)
    throw new UnauthorizedError("Password reset token is invalid or expired");
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await runInTransaction(async (session) => {
    const consumed = await passwordResetRepository.consume(reset._id, session);
    if (!consumed)
      throw new UnauthorizedError("Password reset token was already used");
    await userRepository.updatePasswordHash(
      reset.userId,
      passwordHash,
      session,
    );
    await authSessionRepository.revokeAllForUser(reset.userId, session);
    await activityRepository.appendActivityLog(
      {
        actorId: reset.userId,
        entityType: ACTIVITY_ENTITY_TYPE.PASSWORD_RESET,
        entityId: reset._id,
        action: ACTIVITY_ACTION.PASSWORD_RESET_COMPLETED,
      },
      session,
    );
  });
}

export default { login, refresh, logout, confirmPasswordReset };
