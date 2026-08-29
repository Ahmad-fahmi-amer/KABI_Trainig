import Task from "./task.model.js";
import { TASK_STATUS } from "../../../../constants/task.js";
function withSession(query, session) {
  return session ? query.session(session) : query;
}

async function createTask(data, session) {
  const task = new Task(data);
  await task.save({ session });
  return task.toObject();
}

async function findTaskById(id, session) {
  return withSession(Task.findById(id).lean(), session);
}

async function findTasks(query) {
  const {
    assigneeId,
    teamId,
    status,
    excludedStatuses,
    priority,
    overdue,
    search,
    page,
    limit,
  } = query;

  const filter = {};

  if (assigneeId) {
    filter.assigneeId = assigneeId;
  }

  if (teamId) {
    filter.teamId = teamId;
  }

  if (status) {
    filter.status = status;
  } else if (excludedStatuses?.length) {
    filter.status = {
      $nin: excludedStatuses,
    };
  }

  if (priority) {
    filter.priority = priority;
  }

  if (overdue) {
    filter.dueDate = {
      $lt: new Date(),
    };
  }

  if (search) {
    filter.$text = {
      $search: search,
    };
  }

  const projection = search
    ? {
        score: {
          $meta: "textScore",
        },
      }
    : undefined;

  const sort = search
    ? {
        score: {
          $meta: "textScore",
        },
        createdAt: -1,
        _id: -1,
      }
    : {
        dueDate: 1,
        createdAt: -1,
        _id: -1,
      };

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Task.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),

    Task.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

async function updateTaskDetails(id, data, session) {
  return withSession(
    Task.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function updateTaskStatus(id, expectedStatus, status, session) {
  return withSession(
    Task.findOneAndUpdate(
      { _id: id, status: expectedStatus },
      { $set: { status } },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function addComment(taskId, comment, session) {
  return withSession(
    Task.findOneAndUpdate(
      { _id: taskId, "comments.39": { $exists: false } },
      { $push: { comments: comment } },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function updateComment(taskId, commentId, content, session) {
  return withSession(
    Task.findOneAndUpdate(
      { _id: taskId, "comments._id": commentId },
      {
        $set: {
          "comments.$.content": content,
          "comments.$.updatedAt": new Date(),
        },
      },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function removeComment(taskId, commentId, session) {
  return withSession(
    Task.findOneAndUpdate(
      { _id: taskId, "comments._id": commentId },
      { $pull: { comments: { _id: commentId } } },
      { new: true },
    ).lean(),
    session,
  );
}

async function addAttachment(taskId, attachment, session) {
  return withSession(
    Task.findOneAndUpdate(
      { _id: taskId, "attachments.9": { $exists: false } },
      { $push: { attachments: attachment } },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function removeAttachment(taskId, attachmentId, session) {
  return withSession(
    Task.findOneAndUpdate(
      { _id: taskId, "attachments._id": attachmentId },
      { $pull: { attachments: { _id: attachmentId } } },
      { new: true },
    ).lean(),
    session,
  );
}

const getDailyReportStats = async () => {
  const now = new Date();

  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const startOfTomorrow = new Date(startOfToday);

  startOfTomorrow.setUTCDate(startOfTomorrow.getUTCDate() + 1);

  const [stats] = await Task.aggregate([
    {
      $facet: {
        total: [
          {
            $count: "count",
          },
        ],

        byStatus: [
          {
            $group: {
              _id: "$status",
              count: {
                $sum: 1,
              },
            },
          },
        ],

        dueToday: [
          {
            $match: {
              status: {
                $in: ["NEW", "IN_PROGRESS"],
              },

              dueDate: {
                $gte: startOfToday,
                $lt: startOfTomorrow,
              },
            },
          },

          {
            $count: "count",
          },
        ],

        overdue: [
          {
            $match: {
              status: {
                $in: ["NEW", "IN_PROGRESS"],
              },

              dueDate: {
                $lte: now,
              },
            },
          },

          {
            $count: "count",
          },
        ],
      },
    },
  ]);

  const statusCounts = Object.fromEntries(
    stats.byStatus.map(({ _id, count }) => [_id, count]),
  );

  return {
    total: stats.total[0]?.count ?? 0,

    new: statusCounts.NEW ?? 0,

    inProgress: statusCounts.IN_PROGRESS ?? 0,

    completed: statusCounts.COMPLETED ?? 0,

    cancelled: statusCounts.CANCELLED ?? 0,

    dueToday: stats.dueToday[0]?.count ?? 0,

    overdue: stats.overdue[0]?.count ?? 0,
  };
};

async function findTasksForReminders() {
  const now = new Date();
  const dueSoonUntil = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  return Task.find({
    status: {
      $in: [TASK_STATUS.NEW, TASK_STATUS.IN_PROGRESS],
    },
    dueDate: {
      $lte: dueSoonUntil,
    },
  })
    .select("_id title dueDate status assigneeId")
    .lean();
}

export default {
  createTask,
  findTaskById,
  findTasks,
  updateTaskDetails,
  updateTaskStatus,
  addComment,
  updateComment,
  removeComment,
  addAttachment,
  removeAttachment,
  getDailyReportStats,
  findTasksForReminders,
};
