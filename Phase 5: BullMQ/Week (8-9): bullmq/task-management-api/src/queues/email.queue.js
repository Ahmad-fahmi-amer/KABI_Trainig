import { Queue } from "bullmq";
import { getBullMQConnection } from "../config/bullmq.js";

export const emailQueue = new Queue("emails", {
  connection: getBullMQConnection(),
});

export const enqueueEmailJob = async ({ recipient, subject, text, jobId }) => {
  return emailQueue.add(
    "send-email",
    {
      recipient,
      subject,
      text,
    },

    {
      ...(jobId ? { jobId } : {}),

      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: {
        count: 100,
      },

      removeOnFail: {
        count: 500,
      },
    },
  );
};

export const closeEmailQueue = async () => {
  await emailQueue.close();
};
