import mongoose from "mongoose";
import {
  TASK_PRIORITY,
  TASK_PRIORITY_VALUES,
  TASK_STATUS,
  TASK_STATUS_VALUES,
} from "../../../../constants/task.js";

const { Schema, model } = mongoose;

const commentSchema = new Schema(
  {
    content: { type: String, required: true, trim: true, maxlength: 2000 },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { versionKey: false },
);

const attachmentSchema = new Schema(
  {
    fileName: { type: String, required: true, trim: true, maxlength: 255 },
    mimeType: { type: String, required: true, trim: true, maxlength: 100 },
    size: { type: Number, required: true, min: 1 },
    storageKey: { type: String, required: true, maxlength: 512, trim: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    uploadedAt: {
      type: Date,
      required: true,
      default: Date.now,
      immutable: true,
    },
  },
  { versionKey: false },
);

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150,
    },
    description: { type: String, trim: true, maxlength: 5000, default: null },
    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: TASK_STATUS.NEW,
      required: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: TASK_PRIORITY.MEDIUM,
      required: true,
    },
    dueDate: { type: Date, required: true },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: "Team",
      required: true,
      immutable: true,
    },
    comments: {
      type: [commentSchema],
      default: [],
      validate: [
        (comments) => comments.length <= 40,
        "A task cannot contain more than 40 comments",
      ],
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
      validate: [
        (attachments) => attachments.length <= 10,
        "A task cannot contain more than 10 attachments",
      ],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "tasks" },
);

taskSchema.index({ status: 1, dueDate: 1 });
taskSchema.index({ assigneeId: 1, status: 1, dueDate: 1 });
taskSchema.index({ teamId: 1, status: 1, dueDate: 1 });
taskSchema.index({ teamId: 1, priority: 1, createdAt: -1 });
taskSchema.index(
  { title: "text", description: "text" },
  {
    weights: {
      title: 5,
      description: 1,
    },
    name: "task_text_search",
  },
);

export default model("Task", taskSchema);
