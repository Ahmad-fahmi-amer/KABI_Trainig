import ActivityLog from "./activity-log.model.js";

async function appendActivityLog(data, session) {
  const log = new ActivityLog(data);
  await log.save({ session });
  return log.toObject();
}

async function findActivityLogs({
  actorId,
  entityType,
  entityId,
  action,
  page,
  limit,
}) {
  const filter = {};
  if (actorId) filter.actorId = actorId;
  if (entityType) filter.entityType = entityType;
  if (entityId) filter.entityId = entityId;
  if (action) filter.action = action;
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ActivityLog.countDocuments(filter),
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

export default { appendActivityLog, findActivityLogs };
