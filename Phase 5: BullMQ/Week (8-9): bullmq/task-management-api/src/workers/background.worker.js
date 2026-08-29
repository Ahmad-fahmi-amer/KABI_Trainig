import { Worker } from "bullmq";

import { env } from "../config/env.js";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../config/database.js";

import { generateDailyTaskReport } from "../service/daily-report.service.js";
import { scanTaskReminders } from "../service/task-reminder.service.js";
import { closeEmailQueue } from "../queues/email.queue.js";
import { setupWorkerLifecycle } from "./worker-lifecycle.js";
import logger from "../logger/logger.js";
import { getBullMQConnection } from "../config/bullmq.js";

let worker = null;
let isDatabaseConnected = false;
let closeWorkerSafely = null;

async function closeDependencies() {
  await closeEmailQueue();
  logger.info("Email queue closed successfully");

  if (isDatabaseConnected) {
    await disconnectFromDatabase();
    isDatabaseConnected = false;

    logger.info("Database disconnected successfully");
  }
}

async function startWorker() {
  await connectToDatabase();
  isDatabaseConnected = true;

  worker = new Worker(
    "background-tasks",

    async (job) => {
      logger.info("Processing background job", {
        jobId: job.id,
        jobName: job.name,
        attemptsMade: job.attemptsMade,
      });

      switch (job.name) {
        case "generate-daily-task-report":
          return generateDailyTaskReport({
            executionId: job.id,
          });

        case "scan-task-reminders":
          return scanTaskReminders();

        default:
          throw new Error(`Unsupported background job: ${job.name}`);
      }
    },

    {
      connection: getBullMQConnection(),
      concurrency: env.BACKGROUND_WORKER_CONCURRENCY,
    },
  );

  worker.on("completed", (job, result) => {
    logger.info("Background job completed", {
      jobId: job.id,
      jobName: job.name,
      attemptsMade: job.attemptsMade,
      result,
    });
  });

  worker.on("failed", (job, error) => {
    logger.error("Background job failed", {
      jobId: job?.id,
      jobName: job?.name,
      attemptsMade: job?.attemptsMade,
      errorName: error.name,
      errorMessage: error.message,
    });
  });

  const lifecycle = setupWorkerLifecycle({
    worker,
    workerName: "Background worker",
    cleanup: closeDependencies,
  });

  closeWorkerSafely = lifecycle.closeWorkerSafely;

  logger.info("Background worker started successfully");
}

try {
  await startWorker();
} catch (error) {
  logger.error("Background worker startup failed", {
    errorName: error.name,
    errorMessage: error.message,
  });

  try {
    if (closeWorkerSafely) {
      await closeWorkerSafely();
    }

    await closeDependencies();
  } catch (cleanupError) {
    logger.error("Background worker startup cleanup failed", {
      errorName: cleanupError.name,
      errorMessage: cleanupError.message,
    });
  }

  process.exit(1);
}
