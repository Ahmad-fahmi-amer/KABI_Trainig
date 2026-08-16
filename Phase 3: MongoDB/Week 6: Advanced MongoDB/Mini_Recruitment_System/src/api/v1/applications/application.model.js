import mongoose from "mongoose";

import {
  APPLICATION_RESUME_MEDIA_TYPE_VALUES,
  APPLICATION_STATUSES,
  APPLICATION_STATUS_VALUES,
  FINAL_APPLICATION_STATUSES,
  MAX_APPLICATION_RESUME_SIZE_BYTES,
} from "./application.constants.js";

import {
  EMPLOYMENT_TYPE_VALUES,
  EXPERIENCE_LEVEL_VALUES,
  WORKPLACE_TYPE_VALUES,
} from "../jobs/job.constants.js";

const { Schema, model } = mongoose;

const applicationResumeSchema = new Schema(
  {
    fileId: {
      type: String,
      required: [true, "Application resume file identifier is required"],
      trim: true,
    },

    fileName: {
      type: String,
      required: [true, "Application resume file name is required"],
      trim: true,
    },

    mediaType: {
      type: String,
      enum: {
        values: APPLICATION_RESUME_MEDIA_TYPE_VALUES,
        message: "Unsupported Application resume media type: {VALUE}",
      },
      required: [true, "Application resume media type is required"],
    },

    size: {
      type: Number,
      required: [true, "Application resume file size is required"],
      min: [1, "Application resume file size must be greater than zero"],
      max: [
        MAX_APPLICATION_RESUME_SIZE_BYTES,
        "Application resume file size exceeds the allowed limit",
      ],
    },

    uploadedAt: {
      type: Date,
      required: [true, "Application resume upload time is required"],
      default: Date.now,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const candidateSnapshotSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "Candidate snapshot first name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Candidate snapshot last name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Candidate snapshot email is required"],
      trim: true,
      lowercase: true,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const salaryRangeSnapshotSchema = new Schema(
  {
    min: {
      type: Number,
      required: [true, "Minimum salary snapshot value is required"],
      min: [0, "Minimum salary snapshot cannot be negative"],
    },

    max: {
      type: Number,
      required: [true, "Maximum salary snapshot value is required"],
      min: [0, "Maximum salary snapshot cannot be negative"],
    },

    currency: {
      type: String,
      required: [true, "Salary snapshot currency is required"],
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

salaryRangeSnapshotSchema.pre(
  "validate",
  function validateSalaryRangeSnapshot() {
    if (
      typeof this.min === "number" &&
      typeof this.max === "number" &&
      this.min > this.max
    ) {
      this.invalidate(
        "max",
        "Maximum salary snapshot must be greater than or equal to minimum salary",
      );
    }
  },
);

function createRequiredSnapshotStringArrayField(fieldLabel) {
  return {
    type: [
      {
        type: String,
        trim: true,
      },
    ],

    required: [true, `${fieldLabel} snapshot is required`],

    validate: {
      validator(values) {
        return (
          Array.isArray(values) &&
          values.length > 0 &&
          values.every(
            (value) => typeof value === "string" && value.trim().length > 0,
          )
        );
      },

      message: `${fieldLabel} snapshot must contain at least one non-empty value`,
    },
  };
}

function createOptionalSnapshotStringArrayField(fieldLabel) {
  return {
    type: [
      {
        type: String,
        trim: true,
      },
    ],

    default: [],

    validate: {
      validator(values) {
        return (
          Array.isArray(values) &&
          values.every(
            (value) => typeof value === "string" && value.trim().length > 0,
          )
        );
      },

      message: `${fieldLabel} snapshot must contain only non-empty values`,
    },
  };
}

const jobSnapshotSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job snapshot title is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Job snapshot department is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Job snapshot location is required"],
      trim: true,
    },

    employmentType: {
      type: String,
      enum: {
        values: EMPLOYMENT_TYPE_VALUES,
        message: "Invalid Job snapshot employment type: {VALUE}",
      },
      required: [true, "Job snapshot employment type is required"],
    },

    workplaceType: {
      type: String,
      enum: {
        values: WORKPLACE_TYPE_VALUES,
        message: "Invalid Job snapshot workplace type: {VALUE}",
      },
      required: [true, "Job snapshot workplace type is required"],
    },

    experienceLevel: {
      type: String,
      enum: {
        values: EXPERIENCE_LEVEL_VALUES,
        message: "Invalid Job snapshot experience level: {VALUE}",
      },
      required: [true, "Job snapshot experience level is required"],
    },

    description: {
      type: String,
      required: [true, "Job snapshot description is required"],
      trim: true,
    },

    responsibilities:
      createRequiredSnapshotStringArrayField("Responsibilities"),

    requirements: createRequiredSnapshotStringArrayField("Requirements"),

    niceToHaveQualifications: createOptionalSnapshotStringArrayField(
      "Nice-to-have qualifications",
    ),

    salaryRange: {
      type: salaryRangeSnapshotSchema,
      default: null,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const finalOverrideSchema = new Schema(
  {
    previousStatus: {
      type: String,
      enum: {
        values: FINAL_APPLICATION_STATUSES,
        message: "Override previous status must be a final Application status",
      },
      required: [true, "Override previous status is required"],
    },

    reason: {
      type: String,
      required: [true, "Application override reason is required"],
      trim: true,
    },

    overriddenBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Application override actor is required"],
    },

    overriddenAt: {
      type: Date,
      required: [true, "Application override timestamp is required"],
      default: Date.now,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const applicationSchema = new Schema(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Candidate identifier is required"],
      immutable: true,
    },

    jobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job identifier is required"],
      immutable: true,
    },

    status: {
      type: String,
      enum: {
        values: APPLICATION_STATUS_VALUES,
        message: "Invalid Application status: {VALUE}",
      },
      required: [true, "Application status is required"],
      default: APPLICATION_STATUSES.SUBMITTED,
    },

    coverLetter: {
      type: String,
      trim: true,
      default: null,
    },

    applicationResume: {
      type: applicationResumeSchema,
      required: [true, "Application-specific resume is required"],
    },

    candidateSnapshot: {
      type: candidateSnapshotSchema,
      required: [true, "Candidate identity snapshot is required"],
      immutable: true,
    },

    jobSnapshot: {
      type: jobSnapshotSchema,
      required: [true, "Job business snapshot is required"],
      immutable: true,
    },

    appliedAt: {
      type: Date,
      required: [true, "Application date is required"],
      default: Date.now,
      immutable: true,
    },

    finalOverride: {
      type: finalOverrideSchema,
      default: null,
    },
  },
  {
    collection: "applications",
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

applicationSchema.pre("validate", function validateApplicationDocument() {
  if (
    this.finalOverride &&
    !FINAL_APPLICATION_STATUSES.includes(this.finalOverride.previousStatus)
  ) {
    this.invalidate(
      "finalOverride.previousStatus",
      "Only a previous final Application status may be administratively overridden",
    );
  }
});

applicationSchema
  .virtual("candidateFacingStatus")
  .get(function getCandidateFacingStatus() {
    const mapping = {
      [APPLICATION_STATUSES.SUBMITTED]: "SUBMITTED",
      [APPLICATION_STATUSES.UNDER_REVIEW]: "UNDER_REVIEW",
      [APPLICATION_STATUSES.SHORTLISTED]: "IN_PROCESS",
      [APPLICATION_STATUSES.INTERVIEW]: "INTERVIEW_STAGE",
      [APPLICATION_STATUSES.HIRED]: "HIRED",
      [APPLICATION_STATUSES.REJECTED]: "NOT_SELECTED",
      [APPLICATION_STATUSES.WITHDRAWN]: "WITHDRAWN",
    };

    return mapping[this.status];
  });

applicationSchema.virtual("isFinal").get(function getIsFinal() {
  return FINAL_APPLICATION_STATUSES.includes(this.status);
});

applicationSchema
  .virtual("resumeReplaceable")
  .get(function getResumeReplaceable() {
    return this.status === APPLICATION_STATUSES.SUBMITTED;
  });

applicationSchema.index(
  {
    candidateId: 1,
    jobId: 1,
  },
  {
    unique: true,
    name: "uq_applications_candidate_job",
  },
);

applicationSchema.index(
  {
    candidateId: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_applications_candidate_createdAt_id",
  },
);

applicationSchema.index(
  {
    jobId: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_applications_job_createdAt_id",
  },
);

applicationSchema.index(
  {
    jobId: 1,
    status: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_applications_job_status_createdAt_id",
  },
);

export const Application =
  mongoose.models.Application || model("Application", applicationSchema);
