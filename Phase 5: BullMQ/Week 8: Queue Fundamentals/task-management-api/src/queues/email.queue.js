import { Queue } from "bullmq";
import { env } from "../config/env.js";

const redisUrl = new URL(env.REDIS_URL);

const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
};

const emailQueue = new Queue("emails", {
  connection,
});

export const enqueueEmailJob = async ({ recipient, subject, text }) => {
  return emailQueue.add(
    "send-email",
    {
      recipient,
      subject,
      text,
    },
    {
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
