import mongoose from "mongoose";
import {
  ACTIVITY_ACTION_VALUES,
  ACTIVITY_ENTITY_TYPE_VALUES,
} from "../../../../constants/activity.js";

const { Schema, model } = mongoose;

const activityLogSchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      immutable: true,
    },
    action: {
      type: String,
      enum: ACTIVITY_ACTION_VALUES,
      required: true,
      immutable: true,
    },
    entityType: {
      type: String,
      enum: ACTIVITY_ENTITY_TYPE_VALUES,
      required: true,
      immutable: true,
    },
    entityId: { type: Schema.Types.ObjectId, default: null, immutable: true },
    parentEntityId: {
      type: Schema.Types.ObjectId,
      default: null,
      immutable: true,
    },
    changedFields: { type: [String], default: [], immutable: true },
    requestId: { type: String, default: null, immutable: true },
    ipAddress: { type: String, default: null, immutable: true },
    userAgent: { type: String, maxlength: 500, default: null, immutable: true },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
      immutable: true,
    },
  },
  { versionKey: false, collection: "activityLogs" },
);

activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
activityLogSchema.index({ actorId: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index(
  { requestId: 1 },
  { partialFilterExpression: { requestId: { $type: "string" } } },
);

export default model("ActivityLog", activityLogSchema);
