import bcrypt from "bcrypt";
import crypto from "node:crypto";
import ROLES from "../../../../constants/roles.js";
import USER_STATUS from "../../../../constants/user-status.js";
import {
  ACTIVITY_ACTION,
  ACTIVITY_ENTITY_TYPE,
} from "../../../../constants/activity.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../../../errors/index.js";
import { runInTransaction } from "../../../../database/unit-of-work.js";
import { env } from "../../../../config/env.js";
import activityRepository from "../activity-logs/activity-log.repository.js";
import authSessionRepository from "../auth-sessions/auth-session.repository.js";
import teamRepository from "../teams/team.repository.js";
import passwordResetRepository from "../password-reset-tokens/password-reset-token.repository.js";
import userRepository from "./user.repository.js";
import mongoose from "mongoose";

async function requireUser(id, session) {
  const user = await userRepository.findUserById(id, session);
  if (!user) throw new NotFoundError("User not found");
  return user;
}

async function findUserById(id) {
  return userRepository.findUserById(id);
}

async function getUserById(id) {
  return requireUser(id);
}

async function getAllUsers(query, actor) {
  const scopedQuery =
    actor.role === ROLES.TEAM_MANAGER
      ? { ...query, teamId: String(actor.teamId) }
      : query;
  return userRepository.findUsers(scopedQuery);
}

async function validateAssignment(data, session) {
  if (
    data.teamId &&
    !(await teamRepository.findTeamById(data.teamId, session))
  ) {
    throw new NotFoundError("Team not found");
  }
  if (
    data.status === USER_STATUS.ACTIVE &&
    data.role !== ROLES.SYSTEM_ADMIN &&
    !data.teamId
  ) {
    throw new ConflictError("Active managers and employees require a team");
  }
}

async function createUser(data, actor, context = {}) {
  if (await userRepository.existsUserByEmail(data.email))
    throw new ConflictError("Email is already used");
  const status =
    data.status ??
    (data.teamId || data.role === ROLES.SYSTEM_ADMIN
      ? USER_STATUS.ACTIVE
      : USER_STATUS.INACTIVE);
  const input = { ...data, status };
  await validateAssignment(input);
  const passwordHash = await bcrypt.hash(data.password, 12);
  delete input.password;

  return runInTransaction(async (session) => {
    const user = await userRepository.createUser(
      {
        ...input,
        passwordHash,
        createdBy: actor._id,
      },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.USER,
        entityId: user._id,
        action: ACTIVITY_ACTION.USER_CREATED,
        requestId: context.requestId,
      },
      session,
    );
    return user;
  });
}

async function updateProfile(id, data) {
  await requireUser(id);
  return userRepository.updateUserProfile(id, data);
}

async function updateUser(id, data, actor, context = {}) {
  const current = await requireUser(id);
  if (
    String(current._id) === String(actor._id) &&
    data.status === USER_STATUS.INACTIVE
  ) {
    throw new ForbiddenError("Administrators cannot deactivate themselves");
  }
  await validateAssignment({ ...current, ...data });
  return runInTransaction(async (session) => {
    const user = await userRepository.updateUserProfile(id, data, session);
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.USER,
        entityId: current._id,
        action:
          data.status && data.status !== current.status
            ? ACTIVITY_ACTION.USER_STATUS_CHANGED
            : ACTIVITY_ACTION.USER_UPDATED,
        changedFields: Object.keys(data),
        requestId: context.requestId,
      },
      session,
    );
    if (data.status === USER_STATUS.INACTIVE) {
      await authSessionRepository.revokeAllForUser(id, session);
    }
    return user;
  });
}

async function changePassword(id, { currentPassword, newPassword }) {
  const authUser = await userRepository.findAuthUserByEmail(
    (await requireUser(id)).email,
  );
  if (!(await bcrypt.compare(currentPassword, authUser.passwordHash))) {
    throw new UnauthorizedError("Current password is incorrect");
  }
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await runInTransaction(async (session) => {
    await userRepository.updatePasswordHash(id, passwordHash, session);
    await authSessionRepository.revokeAllForUser(id, session);
    await activityRepository.appendActivityLog(
      {
        actorId: id,
        entityType: ACTIVITY_ENTITY_TYPE.USER,
        entityId: id,
        action: ACTIVITY_ACTION.USER_PASSWORD_CHANGED,
      },
      session,
    );
  });
}

async function resetPassword(id, newPassword, actor) {
  await requireUser(id);
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await runInTransaction(async (session) => {
    await userRepository.updatePasswordHash(id, passwordHash, session);
    await authSessionRepository.revokeAllForUser(id, session);
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.USER,
        entityId: id,
        action: ACTIVITY_ACTION.USER_PASSWORD_CHANGED,
        changedFields: ["passwordHash"],
      },
      session,
    );
  });
}

async function issuePasswordResetToken(id, actor) {
  await requireUser(id);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(
    Date.now() + env.PASSWORD_RESET_EXPIRES_MINUTES * 60_000,
  );
  await runInTransaction(async (session) => {
    await passwordResetRepository.revokeActiveForUser(id, session);
    const reset = await passwordResetRepository.create(
      { userId: id, tokenHash, expiresAt, createdBy: actor._id },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.PASSWORD_RESET,
        entityId: reset._id,
        action: ACTIVITY_ACTION.PASSWORD_RESET_ISSUED,
      },
      session,
    );
  });
  return { token, expiresAt };
}

export default {
  findUserById,
  getUserById,
  getAllUsers,
  createUser,
  updateProfile,
  updateUser,
  changePassword,
  resetPassword,
  issuePasswordResetToken,
};
