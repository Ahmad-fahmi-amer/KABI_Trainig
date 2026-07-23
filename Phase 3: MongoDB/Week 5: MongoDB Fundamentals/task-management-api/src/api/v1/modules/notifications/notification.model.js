import mongoose from "mongoose";
import { NOTIFICATION_TYPE_VALUES } from "../../../../constants/notification.js";

const { Schema, model } = mongoose;

const notificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPE_VALUES,
      required: true,
      immutable: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
      immutable: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
      immutable: true,
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      default: null,
      immutable: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      immutable: true,
    },
    isRead: { type: Boolean, required: true, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false, collection: "notifications" },
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export default model("Notification", notificationSchema);
