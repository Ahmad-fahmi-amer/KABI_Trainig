import notificationRepository from "../api/v1/modules/notifications/notification.repository.js";
import taskRepository from "../api/v1/modules/tasks/task.repository.js";
import NOTIFICATION_TYPE from "../constants/notification.js";

function buildReminderContent(task, type) {
  if (type === NOTIFICATION_TYPE.TASK_OVERDUE) {
    return {
      title: "Task overdue",
      message: `Task "${task.title}" is overdue.`,
    };
  }

  return {
    title: "Task due soon",
    message: `Task "${task.title}" is due soon.`,
  };
}
export async function scanTaskReminders() {
  const tasks = await taskRepository.findTasksForReminders();

  const now = new Date();

  const summary = {
    matched: tasks.length,
    created: 0,
    duplicates: 0,
    skippedNoAssignee: 0,
  };

  for (const task of tasks) {
    if (!task.assigneeId) {
      summary.skippedNoAssignee += 1;
      continue;
    }

    const dueDate = new Date(task.dueDate);

    const type =
      dueDate.getTime() <= now.getTime()
        ? NOTIFICATION_TYPE.TASK_OVERDUE
        : NOTIFICATION_TYPE.TASK_DUE_SOON;

    const dedupeKey = `${type}:${task._id}:${dueDate.toISOString()}`;

    const { title, message } = buildReminderContent(task, type);

    const result = await notificationRepository.createReminderIfAbsent({
      recipientId: task.assigneeId,
      type,
      title,
      message,
      taskId: task._id,
      actorId: null,
      dedupeKey,
    });

    if (result.created) {
      summary.created += 1;
    } else {
      summary.duplicates += 1;
    }
  }

  return summary;
}
