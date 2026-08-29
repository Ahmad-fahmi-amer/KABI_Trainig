import { Queue } from "bullmq";
import { getBullMQConnection } from "../config/bullmq.js";

const options = {
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
};
export const backgroundQueue = new Queue("background-tasks", {
  connection: getBullMQConnection(),
  defaultJobOptions: options,
});

export const closeBackgroundQueue = async () => {
  await backgroundQueue.close();
};
