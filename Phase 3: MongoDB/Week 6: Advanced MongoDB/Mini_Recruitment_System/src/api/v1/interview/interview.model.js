import mongoose from "mongoose";

import {
  FINAL_INTERVIEW_STATUSES,
  INTERVIEW_MODES,
  INTERVIEW_MODE_VALUES,
  INTERVIEW_OUTCOME_VALUES,
  INTERVIEW_STATUSES,
  INTERVIEW_STATUS_VALUES,
} from "./interview.constants.js";

const { Schema, model } = mongoose;

const interviewSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: [true, "Application identifier is required"],
      immutable: true,
    },

    name: {
      type: String,
      required: [true, "Interview name is required"],
      trim: true,
    },

    scheduledAt: {
      type: Date,
      required: [true, "Interview schedule is required"],
    },

    durationMinutes: {
      type: Number,
      required: [true, "Interview duration is required"],
      min: [1, "Interview duration must be greater than zero"],
    },

    mode: {
      type: String,
      enum: {
        values: INTERVIEW_MODE_VALUES,
        message: "Invalid Interview mode: {VALUE}",
      },
      required: [true, "Interview mode is required"],
    },

    location: {
      type: String,
      trim: true,
      default: null,
    },

    meetingLink: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: INTERVIEW_STATUS_VALUES,
        message: "Invalid Interview status: {VALUE}",
      },
      required: [true, "Interview status is required"],
      default: INTERVIEW_STATUSES.SCHEDULED,
    },

    notes: {
      type: String,
      trim: true,
      default: null,
    },

    outcome: {
      type: String,
      enum: {
        values: [...INTERVIEW_OUTCOME_VALUES, null],
        message: "Invalid Interview outcome: {VALUE}",
      },
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    noShowAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "interviews",
    timestamps: true,
    strict: "throw",
    minimize: true,
    optimisticConcurrency: true,

    toJSON: {
      virtuals: true,
      transform(_document, returnedObject) {
        delete returnedObject.__v;
        return returnedObject;
      },
    },

    toObject: {
      virtuals: true,
      transform(_document, returnedObject) {
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

interviewSchema.pre("validate", function validateInterviewModeAndLifecycle() {
  if (this.mode === INTERVIEW_MODES.ON_SITE) {
    if (!this.location) {
      this.invalidate("location", "On-site Interview must have a location");
    }

    if (this.meetingLink) {
      this.invalidate(
        "meetingLink",
        "On-site Interview cannot have a meeting link",
      );
    }
  }

  if (this.mode === INTERVIEW_MODES.ONLINE) {
    if (!this.meetingLink) {
      this.invalidate(
        "meetingLink",
        "Online Interview must have a meeting link",
      );
    }

    if (this.location) {
      this.invalidate(
        "location",
        "Online Interview cannot have a physical location",
      );
    }
  }

  const lifecycleTimestamps = [
    this.completedAt,
    this.cancelledAt,
    this.noShowAt,
  ].filter(Boolean);

  if (lifecycleTimestamps.length > 1) {
    this.invalidate(
      "status",
      "Interview cannot have multiple terminal timestamps",
    );
  }

  if (
    this.status === INTERVIEW_STATUSES.SCHEDULED &&
    lifecycleTimestamps.length > 0
  ) {
    this.invalidate(
      "status",
      "Scheduled Interview cannot have a terminal timestamp",
    );
  }

  if (this.status === INTERVIEW_STATUSES.COMPLETED && !this.completedAt) {
    this.invalidate(
      "completedAt",
      "Completed Interview must have a completion timestamp",
    );
  }

  if (this.status === INTERVIEW_STATUSES.CANCELLED && !this.cancelledAt) {
    this.invalidate(
      "cancelledAt",
      "Cancelled Interview must have a cancellation timestamp",
    );
  }

  if (this.status === INTERVIEW_STATUSES.NO_SHOW && !this.noShowAt) {
    this.invalidate(
      "noShowAt",
      "No-show Interview must have a no-show timestamp",
    );
  }
});

interviewSchema.virtual("isFinal").get(function getIsFinal() {
  return FINAL_INTERVIEW_STATUSES.includes(this.status);
});

interviewSchema.virtual("isReschedulable").get(function getIsReschedulable() {
  return this.status === INTERVIEW_STATUSES.SCHEDULED;
});

interviewSchema.index(
  {
    applicationId: 1,
    scheduledAt: 1,
    _id: 1,
  },
  {
    name: "idx_interviews_application_scheduledAt_id",
  },
);

export const Interview =
  mongoose.models.Interview || model("Interview", interviewSchema);
