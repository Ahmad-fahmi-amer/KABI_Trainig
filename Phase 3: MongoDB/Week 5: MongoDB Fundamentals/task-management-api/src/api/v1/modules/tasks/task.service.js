import mongoose from "mongoose";
import ROLES from "../../../../constants/roles.js";
import USER_STATUS from "../../../../constants/user-status.js";
import { TASK_TRANSITIONS } from "../../../../constants/task.js";
import NOTIFICATION_TYPE from "../../../../constants/notification.js";
import {
  ACTIVITY_ACTION,
  ACTIVITY_ENTITY_TYPE,
} from "../../../../constants/activity.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../../errors/index.js";
import { runInTransaction } from "../../../../database/unit-of-work.js";
import activityRepository from "../activity-logs/activity-log.repository.js";
import notificationRepository from "../notifications/notification.repository.js";
import teamRepository from "../teams/team.repository.js";
import userRepository from "../users/user.repository.js";
import taskRepository from "./task.repository.js";

function canAccess(task, actor) {
  return (
    actor.role === ROLES.SYSTEM_ADMIN ||
    String(task.assigneeId) === String(actor._id) ||
    (actor.role === ROLES.TEAM_MANAGER &&
      String(task.teamId) === String(actor.teamId))
  );
}
function requireAccess(task, actor) {
  if (!canAccess(task, actor)) throw new ForbiddenError();
}
async function requireTask(id, actor) {
  const task = await taskRepository.findTaskById(id);
  if (!task) throw new NotFoundError("Task not found");
  requireAccess(task, actor);
  return task;
}
async function validateAssignment(teamId, assigneeId, actor) {
  const [team, assignee] = await Promise.all([
    teamRepository.findTeamById(teamId),
    userRepository.findUserById(assigneeId),
  ]);
  if (!team) throw new NotFoundError("Team not found");
  if (
    !assignee ||
    assignee.status !== USER_STATUS.ACTIVE ||
    String(assignee.teamId) !== String(teamId)
  ) {
    throw new BadRequestError(
      "Assignee must be active and belong to the task team",
    );
  }
  if (
    actor.role === ROLES.TEAM_MANAGER &&
    String(actor.teamId) !== String(teamId)
  )
    throw new ForbiddenError();
}
async function listTasks(query, actor) {
  const scope = { ...query };
  if (!query.status && query.overdue) {
    scope.excludedStatuses = [TASK_STATUS.COMPLETED];
  }
  if (actor.role === ROLES.EMPLOYEE) scope.assigneeId = actor._id;
  if (actor.role === ROLES.TEAM_MANAGER) scope.teamId = actor.teamId;
  return taskRepository.findTasks(scope);
}
async function createTask(data, actor) {
  await validateAssignment(data.teamId, data.assigneeId, actor);
  return runInTransaction(async (session) => {
    const task = await taskRepository.createTask(
      { ...data, createdBy: actor._id },
      session,
    );
    await notificationRepository.createNotification(
      {
        recipientId: data.assigneeId,
        type: NOTIFICATION_TYPE.TASK_ASSIGNED,
        title: "New task assigned",
        message: task.title,
        taskId: task._id,
        actorId: actor._id,
      },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.TASK,
        entityId: task._id,
        action: ACTIVITY_ACTION.TASK_CREATED,
      },
      session,
    );
    return task;
  });
}
async function updateTask(id, data, actor) {
  const current = await requireTask(id, actor);
  if (actor.role === ROLES.EMPLOYEE) throw new ForbiddenError();
  if (data.assigneeId)
    await validateAssignment(current.teamId, data.assigneeId, actor);
  return runInTransaction(async (session) => {
    const task = await taskRepository.updateTaskDetails(id, data, session);
    const reassigned =
      data.assigneeId && String(data.assigneeId) !== String(current.assigneeId);
    await notificationRepository.createNotification(
      {
        recipientId: task.assigneeId,
        type: reassigned
          ? NOTIFICATION_TYPE.TASK_REASSIGNED
          : NOTIFICATION_TYPE.TASK_UPDATED,
        title: reassigned ? "Task reassigned" : "Task updated",
        message: task.title,
        taskId: task._id,
        actorId: actor._id,
      },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.TASK,
        entityId: task._id,
        action: reassigned
          ? ACTIVITY_ACTION.TASK_REASSIGNED
          : ACTIVITY_ACTION.TASK_UPDATED,
        changedFields: Object.keys(data),
      },
      session,
    );
    return task;
  });
}
async function updateStatus(id, status, actor) {
  const current = await requireTask(id, actor);
  if (!TASK_TRANSITIONS[current.status].includes(status))
    throw new BadRequestError("Invalid task status transition");
  return runInTransaction(async (session) => {
    const task = await taskRepository.updateTaskStatus(
      id,
      current.status,
      status,
      session,
    );
    if (!task)
      throw new BadRequestError(
        "Task was modified concurrently; retry the request",
      );
    await notificationRepository.createNotification(
      {
        recipientId: task.assigneeId,
        type: NOTIFICATION_TYPE.TASK_STATUS_CHANGED,
        title: "Task status changed",
        message: `${task.title}: ${status}`,
        taskId: task._id,
        actorId: actor._id,
      },
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.TASK,
        entityId: task._id,
        action: ACTIVITY_ACTION.TASK_STATUS_CHANGED,
        changedFields: ["status"],
      },
      session,
    );
    return task;
  });
}
async function addComment(id, data, actor) {
  const current = await requireTask(id, actor);
  const commentId = new mongoose.Types.ObjectId();
  return runInTransaction(async (session) => {
    const task = await taskRepository.addComment(
      id,
      { _id: commentId, ...data, createdBy: actor._id },
      session,
    );
    if (!task) throw new BadRequestError("Comment limit reached");
    if (String(current.assigneeId) !== String(actor._id))
      await notificationRepository.createNotification(
        {
          recipientId: current.assigneeId,
          type: NOTIFICATION_TYPE.COMMENT_ADDED,
          title: "Comment added",
          message: current.title,
          taskId: current._id,
          actorId: actor._id,
        },
        session,
      );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.COMMENT,
        entityId: commentId,
        parentEntityId: current._id,
        action: ACTIVITY_ACTION.COMMENT_CREATED,
      },
      session,
    );
    return task;
  });
}
async function updateComment(id, commentId, data, actor) {
  const current = await requireTask(id, actor);
  const comment = current.comments.find(
    (item) => String(item._id) === commentId,
  );
  if (!comment) throw new NotFoundError("Comment not found");
  if (
    String(comment.createdBy) !== String(actor._id) &&
    actor.role !== ROLES.SYSTEM_ADMIN
  )
    throw new ForbiddenError();
  return runInTransaction(async (session) => {
    const task = await taskRepository.updateComment(
      id,
      commentId,
      data.content,
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.COMMENT,
        entityId: commentId,
        parentEntityId: current._id,
        action: ACTIVITY_ACTION.COMMENT_UPDATED,
        changedFields: ["content"],
      },
      session,
    );
    return task;
  });
}
async function removeComment(id, commentId, actor) {
  const current = await requireTask(id, actor);
  const comment = current.comments.find(
    (item) => String(item._id) === commentId,
  );
  if (!comment) throw new NotFoundError("Comment not found");
  if (
    String(comment.createdBy) !== String(actor._id) &&
    actor.role !== ROLES.SYSTEM_ADMIN
  )
    throw new ForbiddenError();
  return runInTransaction(async (session) => {
    const task = await taskRepository.removeComment(id, commentId, session);
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.COMMENT,
        entityId: commentId,
        parentEntityId: current._id,
        action: ACTIVITY_ACTION.COMMENT_DELETED,
      },
      session,
    );
    return task;
  });
}
async function addAttachment(id, data, actor) {
  const current = await requireTask(id, actor);
  const attachmentId = new mongoose.Types.ObjectId();
  return runInTransaction(async (session) => {
    const task = await taskRepository.addAttachment(
      id,
      { _id: attachmentId, ...data, uploadedBy: actor._id },
      session,
    );
    if (!task) throw new BadRequestError("Attachment limit reached");
    if (String(current.assigneeId) !== String(actor._id))
      await notificationRepository.createNotification(
        {
          recipientId: current.assigneeId,
          type: NOTIFICATION_TYPE.ATTACHMENT_ADDED,
          title: "Attachment added",
          message: current.title,
          taskId: current._id,
          actorId: actor._id,
        },
        session,
      );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.ATTACHMENT,
        entityId: attachmentId,
        parentEntityId: current._id,
        action: ACTIVITY_ACTION.ATTACHMENT_ADDED,
      },
      session,
    );
    return task;
  });
}
async function removeAttachment(id, attachmentId, actor) {
  const current = await requireTask(id, actor);
  const attachment = current.attachments.find(
    (item) => String(item._id) === attachmentId,
  );
  if (!attachment) throw new NotFoundError("Attachment not found");
  if (
    String(attachment.uploadedBy) !== String(actor._id) &&
    actor.role !== ROLES.SYSTEM_ADMIN
  )
    throw new ForbiddenError();
  return runInTransaction(async (session) => {
    const task = await taskRepository.removeAttachment(
      id,
      attachmentId,
      session,
    );
    await activityRepository.appendActivityLog(
      {
        actorId: actor._id,
        entityType: ACTIVITY_ENTITY_TYPE.ATTACHMENT,
        entityId: attachmentId,
        parentEntityId: current._id,
        action: ACTIVITY_ACTION.ATTACHMENT_DELETED,
      },
      session,
    );
    return task;
  });
}
export default {
  listTasks,
  getTask: requireTask,
  createTask,
  updateTask,
  updateStatus,
  addComment,
  updateComment,
  removeComment,
  addAttachment,
  removeAttachment,
};
