import notificationService from "./notification.service.js";
const map = (item) => ({
  id: String(item._id),
  type: item.type,
  title: item.title,
  message: item.message,
  taskId: item.taskId ? String(item.taskId) : null,
  actorId: item.actorId ? String(item.actorId) : null,
  isRead: item.isRead,
  readAt: item.readAt,
  createdAt: item.createdAt,
});
export async function list(req, res) {
  const result = await notificationService.list(
    req.user._id,
    req.validated.query,
  );
  return res.success({ ...result, items: result.items.map(map) });
}
export async function unreadCount(req, res) {
  return res.success({
    count: await notificationService.unreadCount(req.user._id),
  });
}
export async function markRead(req, res) {
  return res.success(
    map(
      await notificationService.markRead(req.validated.params.id, req.user._id),
    ),
  );
}
export async function markAllRead(req, res) {
  return res.success({
    updated: await notificationService.markAllRead(req.user._id),
  });
}
