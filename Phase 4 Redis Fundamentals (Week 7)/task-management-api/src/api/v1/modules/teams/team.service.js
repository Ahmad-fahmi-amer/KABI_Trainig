import ROLES from "../../../../constants/roles.js";
import USER_STATUS from "../../../../constants/user-status.js";
import {
  ACTIVITY_ACTION,
  ACTIVITY_ENTITY_TYPE,
} from "../../../../constants/activity.js";
import { ConflictError, NotFoundError } from "../../../../errors/index.js";
import { runInTransaction } from "../../../../database/unit-of-work.js";
import activityRepository from "../activity-logs/activity-log.repository.js";
import userRepository from "../users/user.repository.js";
import teamRepository from "./team.repository.js";

async function requireTeam(id) {
  const team = await teamRepository.findTeamById(id);
  if (!team) throw new NotFoundError("Team not found");
  return team;
}
async function requireAvailableManager(id, currentTeamId = null) {
  const manager = await userRepository.findUserById(id);
  if (!manager || manager.role !== ROLES.TEAM_MANAGER)
    throw new ConflictError("Manager must be a TEAM_MANAGER user");
  const existing = await teamRepository.findTeamByManagerId(id);
  if (existing && String(existing._id) !== String(currentTeamId))
    throw new ConflictError("Manager already owns another team");
  return manager;
}
async function createTeam(data, actor) {
  await requireAvailableManager(data.managerId);
  return runInTransaction(async (session) => {
    const team = await teamRepository.createTeam(
      { ...data, createdBy: actor._id },
      session,
    );
    await userRepository.updateUserProfile(
      data.managerId,
      { teamId: team._id, status: USER_STATUS.ACTIVE },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.TEAM,
        entityId: team._id,
        action: ACTIVITY_ACTION.TEAM_CREATED,
      },
      session,
    );
    return team;
  });
}
async function updateTeam(id, data, actor) {
  const current = await requireTeam(id);
  const managerChanged =
    data.managerId && String(data.managerId) !== String(current.managerId);

  if (managerChanged) await requireAvailableManager(data.managerId, id);
  return runInTransaction(async (session) => {
    let team = current;
    if (data.name)
      team = await teamRepository.renameTeam(id, data.name, session);
    if (managerChanged) {
      team = await teamRepository.changeTeamManager(
        id,
        data.managerId,
        session,
      );
      await userRepository.updateUserProfile(
        data.managerId,
        { teamId: id, status: USER_STATUS.ACTIVE },
        session,
      );
      await userRepository.updateUserProfile(
        current.managerId,
        { teamId: null, status: USER_STATUS.INACTIVE },
        session,
      );
    }
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.TEAM,
        entityId: current._id,
        action: ACTIVITY_ACTION.TEAM_UPDATED,
        changedFields: Object.keys(data),
      },
      session,
    );
    return team;
  });
}
export default {
  createTeam,
  updateTeam,
  getTeamById: requireTeam,
  getTeams: teamRepository.findTeams,
};
