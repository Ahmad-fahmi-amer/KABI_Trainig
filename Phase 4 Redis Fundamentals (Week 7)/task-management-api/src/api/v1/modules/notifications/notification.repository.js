import Notification from "./notification.model.js";

async function createNotification(data, session) {
  const notification = new Notification(data);
  await notification.save({ session });
  return notification.toObject();
}

async function findByRecipient(recipientId, { unreadOnly, page, limit }) {
  const filter = { recipientId };
  if (unreadOnly) filter.isRead = false;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter),
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function countUnread(recipientId) {
  return Notification.countDocuments({ recipientId, isRead: false });
}

async function markRead(id, recipientId, readAt) {
  return Notification.findOneAndUpdate(
    { _id: id, recipientId, isRead: false },
    { $set: { isRead: true, readAt } },
    { new: true },
  ).lean();
}

async function markAllRead(recipientId, readAt) {
  const result = await Notification.updateMany(
    { recipientId, isRead: false },
    { $set: { isRead: true, readAt } },
  );
  return result.modifiedCount;
}

export default {
  createNotification,
  findByRecipient,
  countUnread,
  markRead,
  markAllRead,
};
