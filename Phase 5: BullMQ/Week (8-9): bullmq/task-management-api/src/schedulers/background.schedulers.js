const DAILY_REPORT_SCHEDULER_ID = "daily-task-report";
const REMINDER_SCAN_SCHEDULER_ID = "task-reminder-scan";

import { backgroundQueue } from "../queues/background.queue.js";
import logger from "../logger/logger.js";
export async function registerBackgroundSchedulers() {
  await backgroundQueue.upsertJobScheduler(
    DAILY_REPORT_SCHEDULER_ID,
    {
      pattern: "0 8 * * *",
      tz: "UTC",
    },
    // {
    //   every: 60 * 1000,
    // },
    {
      name: "generate-daily-task-report",
      data: {},
    },
  );
  logger.info("Daily task report scheduler registered", {
    schedulerId: DAILY_REPORT_SCHEDULER_ID,
  });
  await backgroundQueue.upsertJobScheduler(
    REMINDER_SCAN_SCHEDULER_ID,
    {
      every: 60 * 60 * 1000,
    },
    // {
    //   every: 60 * 1000,
    // },
    {
      name: "scan-task-reminders",
      data: {},
    },
  );
  logger.info("task reminder scan scheduler registered", {
    schedulerId: REMINDER_SCAN_SCHEDULER_ID,
  });
}
