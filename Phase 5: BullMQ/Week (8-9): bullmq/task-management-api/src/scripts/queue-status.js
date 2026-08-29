import { closeEmailQueue, emailQueue } from "../queues/email.queue.js";
import {
  backgroundQueue,
  closeBackgroundQueue,
} from "../queues/background.queue.js";

async function getQueueStatus(queue) {
  const counts = await queue.getJobCounts(
    "waiting",
    "active",
    "completed",
    "failed",
    "delayed",
  );

  return {
    queue: queue.name,
    ...counts,
  };
}
async function getFailedJobs(queue) {
  const jobs = await queue.getFailed(0, 49);

  return jobs.map((job) => ({
    id: job.id,
    name: job.name,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason,
    data: JSON.stringify(job.data),
    finishedOn: job.finishedOn ? new Date(job.finishedOn).toISOString() : null,
  }));
}
try {
  const emailStatus = await getQueueStatus(emailQueue);
  const backgroundStatus = await getQueueStatus(backgroundQueue);
  console.table([emailStatus, backgroundStatus]);
  const schedulers = await backgroundQueue.getJobSchedulers();
  console.table(
    schedulers.map((scheduler) => ({
      id: scheduler.key,
      name: scheduler.name,
      next: scheduler.next ? new Date(scheduler.next).toISOString() : null,
      pattern: scheduler.pattern ?? null,
      every: scheduler.every ?? null,
    })),
  );
  const failedBackgroundJobs = await getFailedJobs(backgroundQueue);

  console.log("\nFailed background jobs:");
  console.table(failedBackgroundJobs);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await Promise.allSettled([closeEmailQueue(), closeBackgroundQueue()]);
}
