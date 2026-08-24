import { Worker } from "bullmq";
import { env } from "../config/env.js";
import { sendEmail } from "../service/email.service.js";
import logger from "../logger/logger.js";
const redisUrl = new URL(env.REDIS_URL);

const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
};

const worker = new Worker(
  "emails",
  async (job) => {
    if (job.name !== "send-email") {
      throw new Error(`Unsupported email job: ${job.name}`);
    }
    logger.info("Processing email job", {
      jobId: job.id,
      jobName: job.name,
      recipient: job.data.recipient,
      attemptsMade: job.attemptsMade,
    });
    const { recipient, subject, text } = job.data;

    await sendEmail({
      recipient,
      subject,
      text,
    });

    return {
      recipient,
      sent: true,
    };
  },
  {
    connection,
  },
);

worker.on("completed", (job) => {
  logger.info("Email job completed", {
    jobId: job.id,
    jobName: job.name,
    recipient: job.data.recipient,
    attemptsMade: job.attemptsMade,
  });
});

worker.on("failed", (job, error) => {
  logger.error("Email job failed", {
    jobId: job?.id,
    jobName: job?.name,
    recipient: job?.data?.recipient,
    attemptsMade: job?.attemptsMade,
    errorName: error.name,
    errorMessage: error.message,
  });
});
worker.on("error", (error) => {
  logger.error("Email worker error", {
    errorName: error.name,
    errorMessage: error.message,
  });
});

let isShuttingDown = false;

const shutdown = async (signal) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(`Email worker shutting down | signal=${signal}`);

  try {
    await worker.close();

    logger.info("Email worker closed successfully");
    process.exitCode = 0;
  } catch (error) {
    logger.error(`Email worker shutdown failed | error=${error.message}`);

    process.exitCode = 1;
  }
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});
