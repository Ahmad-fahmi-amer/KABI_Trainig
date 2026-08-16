import mongoose from "mongoose";

import {
  EMPLOYMENT_TYPE_VALUES,
  EXPERIENCE_LEVEL_VALUES,
  JOB_STATUSES,
  JOB_STATUS_VALUES,
  WORKPLACE_TYPE_VALUES,
} from "./job.constants.js";

const { Schema, model } = mongoose;

const salaryRangeSchema = new Schema(
  {
    min: {
      type: Number,
      required: [true, "Minimum salary is required"],
      min: [0, "Minimum salary cannot be negative"],
    },

    max: {
      type: Number,
      required: [true, "Maximum salary is required"],
      min: [0, "Maximum salary cannot be negative"],
    },

    currency: {
      type: String,
      required: [true, "Salary currency is required"],
      trim: true,
      uppercase: true,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

salaryRangeSchema.pre("validate", function validateSalaryRange() {
  if (
    typeof this.min === "number" &&
    typeof this.max === "number" &&
    this.min > this.max
  ) {
    this.invalidate(
      "max",
      "Maximum salary must be greater than or equal to minimum salary",
    );
  }
});

const assignedRecruiterSchema = new Schema(
  {
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Assigned recruiter identifier is required"],
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

function createNonEmptyStringArrayField(fieldLabel) {
  return {
    type: [
      {
        type: String,
        trim: true,
      },
    ],
    required: [true, `${fieldLabel} are required`],
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
      message: `${fieldLabel} must contain at least one non-empty value`,
    },
  };
}

function createOptionalStringArrayField(fieldLabel) {
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
      message: `${fieldLabel} must contain only non-empty values`,
    },
  };
}

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Job department is required"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },

    employmentType: {
      type: String,
      enum: {
        values: EMPLOYMENT_TYPE_VALUES,
        message: "Invalid employment type: {VALUE}",
      },
      required: [true, "Employment type is required"],
    },

    workplaceType: {
      type: String,
      enum: {
        values: WORKPLACE_TYPE_VALUES,
        message: "Invalid workplace type: {VALUE}",
      },
      required: [true, "Workplace type is required"],
    },

    experienceLevel: {
      type: String,
      enum: {
        values: EXPERIENCE_LEVEL_VALUES,
        message: "Invalid experience level: {VALUE}",
      },
      required: [true, "Experience level is required"],
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },

    responsibilities: createNonEmptyStringArrayField("Responsibilities"),

    requirements: createNonEmptyStringArrayField("Requirements"),

    niceToHaveQualifications: createOptionalStringArrayField(
      "Nice-to-have qualifications",
    ),

    salaryRange: {
      type: salaryRangeSchema,
      default: null,
    },

    applicationDeadline: {
      type: Date,
      default: null,
    },

    internalNotes: {
      type: String,
      trim: true,
      default: null,
    },

    status: {
      type: String,
      enum: {
        values: JOB_STATUS_VALUES,
        message: "Invalid Job status: {VALUE}",
      },
      required: [true, "Job status is required"],
      default: JOB_STATUSES.DRAFT,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Job creator identifier is required"],
      immutable: true,
    },

    assignedRecruiters: {
      type: [assignedRecruiterSchema],
      default: [],
    },

    postedAt: {
      type: Date,
      default: null,
    },

    closedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "jobs",
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

jobSchema.path("assignedRecruiters").validate({
  validator(assignments) {
    if (!Array.isArray(assignments)) {
      return false;
    }

    const recruiterIds = assignments.map((assignment) =>
      assignment.recruiterId.toString(),
    );

    return new Set(recruiterIds).size === recruiterIds.length;
  },

  message: "A recruiter cannot be assigned to the same Job more than once",
});

jobSchema.pre("validate", function validateJobLifecycleFields() {
  if (this.status === JOB_STATUSES.DRAFT) {
    if (this.postedAt) {
      this.invalidate(
        "postedAt",
        "Draft Job cannot have a publication timestamp",
      );
    }

    if (this.closedAt) {
      this.invalidate("closedAt", "Draft Job cannot have a closing timestamp");
    }
  }

  if (this.status === JOB_STATUSES.OPEN && !this.postedAt) {
    this.invalidate("postedAt", "Open Job must have a publication timestamp");
  }

  if (this.status !== JOB_STATUSES.CLOSED && this.closedAt) {
    this.invalidate(
      "closedAt",
      "Only a closed Job may have a closing timestamp",
    );
  }
});

jobSchema
  .virtual("acceptingApplications")
  .get(function getAcceptingApplications() {
    if (this.status !== JOB_STATUSES.OPEN) {
      return false;
    }

    if (!this.applicationDeadline) {
      return true;
    }

    return this.applicationDeadline.getTime() > Date.now();
  });

jobSchema.index(
  {
    "assignedRecruiters.recruiterId": 1,
    status: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_jobs_assignedRecruiter_status_createdAt_id",
  },
);

jobSchema.index(
  {
    status: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_jobs_status_createdAt_id",
  },
);

jobSchema.index(
  {
    status: 1,
    department: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_jobs_status_department_createdAt_id",
  },
);

jobSchema.index(
  {
    status: 1,
    location: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_jobs_status_location_createdAt_id",
  },
);

export const Job = mongoose.models.Job || model("Job", jobSchema);
