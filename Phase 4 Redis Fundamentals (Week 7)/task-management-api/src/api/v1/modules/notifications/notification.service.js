import { notificationCounterCache } from "../../../../cache/notification-count.cache.js";
import { NotFoundError } from "../../../../errors/index.js";
import notificationRepository from "./notification.repository.js";
async function list(userId, query) {
  return notificationRepository.findByRecipient(userId, query);
}
async function unreadCount(userId) {
  const cachedCount = await notificationCounterCache.get(userId);
  if (cachedCount !== null) {
    return cachedCount;
  }
  const count = await notificationRepository.countUnread(userId);
  await notificationCounterCache.set(userId, count);
  return count;
}
async function markRead(id, userId) {
  const item = await notificationRepository.markRead(id, userId, new Date());

  if (!item) throw new NotFoundError("Unread notification not found");

  await notificationCounterCache.decrement(userId);
  return item;
}
async function markAllRead(userId) {
  const updated = notificationRepository.markAllRead(userId, new Date());
  if (updated > 0) {
    await notificationCounterCache.reset(userId);
  }
  return updated;
}
export default { list, unreadCount, markRead, markAllRead };
