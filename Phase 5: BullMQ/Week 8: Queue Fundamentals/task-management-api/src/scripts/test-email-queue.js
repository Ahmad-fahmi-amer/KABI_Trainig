import { enqueueEmailJob, closeEmailQueue } from "../queues/email.queue.js";

try {
  const job = await enqueueEmailJob({
    recipient: "ahmad.fahmi.amer1@gmail.com",
    subject: "BullMQ Queue Test",
    text: "This email job was added through BullMQ.",
  });

  console.log("Email job added:", {
    id: job.id,
    name: job.name,
    data: job.data,
  });
} finally {
  await closeEmailQueue();
}
