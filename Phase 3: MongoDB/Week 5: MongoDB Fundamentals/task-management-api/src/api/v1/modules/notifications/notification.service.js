import { NotFoundError } from "../../../../errors/index.js";
import notificationRepository from "./notification.repository.js";
async function list(userId, query) {
  return notificationRepository.findByRecipient(userId, query);
}
async function unreadCount(userId) {
  return notificationRepository.countUnread(userId);
}
async function markRead(id, userId) {
  const item = await notificationRepository.markRead(id, userId, new Date());
  if (!item) throw new NotFoundError("Unread notification not found");
  return item;
}
async function markAllRead(userId) {
  return notificationRepository.markAllRead(userId, new Date());
}
export default { list, unreadCount, markRead, markAllRead };
