import mongoose from "mongoose";

import { ACCOUNT_ROLE_VALUES } from "../accounts/account.constants.js";

import {
  RECRUITMENT_ACTION_VALUES,
  RECRUITMENT_RESOURCE_TYPE_VALUES,
} from "./recruitment-activity.constants.js";

const { Schema, model } = mongoose;

const actorSnapshotSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Actor first name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Actor last name is required"],
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: ACCOUNT_ROLE_VALUES,
        message: "Invalid actor role: {VALUE}",
      },
      required: [true, "Actor role is required"],
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const recruitmentActivitySchema = new Schema(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      default: null,
      immutable: true,
    },

    actorSnapshot: {
      type: actorSnapshotSchema,
      default: null,
      immutable: true,
    },

    action: {
      type: String,
      enum: {
        values: RECRUITMENT_ACTION_VALUES,
        message: "Invalid Recruitment Activity action: {VALUE}",
      },
      required: [true, "Recruitment Activity action is required"],
      immutable: true,
    },

    resourceType: {
      type: String,
      enum: {
        values: RECRUITMENT_RESOURCE_TYPE_VALUES,
        message: "Invalid Recruitment Activity resource type: {VALUE}",
      },
      required: [true, "Resource type is required"],
      immutable: true,
    },

    resourceId: {
      type: Schema.Types.ObjectId,
      required: [true, "Resource identifier is required"],
      immutable: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      default: null,
      immutable: true,
    },

    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      default: null,
      immutable: true,
    },

    previousValue: {
      type: Schema.Types.Mixed,
      default: null,
      immutable: true,
    },

    newValue: {
      type: Schema.Types.Mixed,
      default: null,
      immutable: true,
    },

    reason: {
      type: String,
      trim: true,
      default: null,
      immutable: true,
    },

    metadata: {
      type: Schema.Types.Mixed,
      default: null,
      immutable: true,
    },
  },
  {
    collection: "recruitmentActivities",
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    strict: "throw",
    minimize: true,

    toJSON: {
      transform(_document, returnedObject) {
        delete returnedObject.__v;
        return returnedObject;
      },
    },

    toObject: {
      transform(_document, returnedObject) {
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

recruitmentActivitySchema.pre("validate", function validateActivityActor() {
  if (this.actorId && !this.actorSnapshot) {
    this.invalidate(
      "actorSnapshot",
      "Activity with an actor must preserve actor context",
    );
  }

  if (!this.actorId && this.actorSnapshot) {
    this.invalidate(
      "actorId",
      "Actor snapshot cannot exist without an actor identifier",
    );
  }
});

recruitmentActivitySchema.index(
  {
    resourceType: 1,
    resourceId: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_activity_resource_createdAt_id",
  },
);

export const RecruitmentActivity =
  mongoose.models.RecruitmentActivity ||
  model("RecruitmentActivity", recruitmentActivitySchema);
