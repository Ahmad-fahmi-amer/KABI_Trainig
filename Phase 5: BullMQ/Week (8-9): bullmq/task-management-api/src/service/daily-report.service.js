import taskRepository from "../api/v1/modules/tasks/task.repository.js";
import userRepository from "../api/v1/modules/users/user.repository.js";
import { enqueueEmailJob } from "../queues/email.queue.js";
function buildDailyReportText(stats) {
  return `
Daily Task Report

Total Tasks: ${stats.total}

Status:
- New: ${stats.new}
- In Progress: ${stats.inProgress}
- Completed: ${stats.completed}
- Cancelled: ${stats.cancelled}

Due Today: ${stats.dueToday}
Overdue: ${stats.overdue}
`.trim();
}
export async function generateDailyTaskReport({ executionId }) {
  const stats = await taskRepository.getDailyReportStats();

  const admins = await userRepository.findActiveSystemAdmins();

  if (admins.length === 0) {
    return {
      recipientCount: 0,
      stats,
    };
  }

  const text = buildDailyReportText(stats);

  await Promise.all(
    admins.map((admin) => {
      const safeExecutionId = String(executionId).replaceAll(":", "-");

      return enqueueEmailJob({
        recipient: admin.email,
        subject: "Daily Task Report",
        text,
        jobId: `daily-report-${safeExecutionId}-${admin._id}`,
      });
    }),
  );

  return {
    recipientCount: admins.length,
    stats,
  };
}
