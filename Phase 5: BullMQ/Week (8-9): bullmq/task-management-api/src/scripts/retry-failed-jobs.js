import {
  backgroundQueue,
  closeBackgroundQueue,
} from "../queues/background.queue.js";

async function retryFailedJobs() {
  try {
    const failedJobs = await backgroundQueue.getFailed(0, 49);

    if (failedJobs.length === 0) {
      console.log("No failed jobs found");
      return;
    }

    for (const job of failedJobs) {
      console.log("Retrying failed job", {
        id: job.id,
        name: job.name,
        failedReason: job.failedReason,
      });

      await job.retry();

      console.log(`Retried job: ${job.id}`);
    }
  } catch (error) {
    console.error("Failed to retry jobs:", error);
    process.exitCode = 1;
  } finally {
    await closeBackgroundQueue();
  }
}

await retryFailedJobs();
