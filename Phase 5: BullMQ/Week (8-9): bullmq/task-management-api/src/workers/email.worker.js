import { Worker } from "bullmq";

import { sendEmail } from "../service/email.service.js";
import { setupWorkerLifecycle } from "./worker-lifecycle.js";
import logger from "../logger/logger.js";
import { getBullMQConnection } from "../config/bullmq.js";

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
    connection: getBullMQConnection(),
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

setupWorkerLifecycle({
  worker,
  workerName: "Email worker",
});
