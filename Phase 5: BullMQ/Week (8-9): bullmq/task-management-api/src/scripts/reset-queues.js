import { emailQueue, closeEmailQueue } from "../queues/email.queue.js";
import {
  backgroundQueue,
  closeBackgroundQueue,
} from "../queues/background.queue.js";

async function resetQueues() {
  try {
    console.log("Resetting queues...");

    await emailQueue.obliterate({ force: true });
    console.log("Email queue reset successfully");

    await backgroundQueue.obliterate({ force: true });
    console.log("Background queue reset successfully");

    console.log("All queues reset successfully");
  } catch (error) {
    console.error("Failed to reset queues:", error);
    process.exitCode = 1;
  } finally {
    await Promise.allSettled([closeEmailQueue(), closeBackgroundQueue()]);
  }
}

await resetQueues();
