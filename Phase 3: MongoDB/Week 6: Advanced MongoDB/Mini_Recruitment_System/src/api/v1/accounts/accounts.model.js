import mongoose from "mongoose";

import {
  ACCOUNT_ROLES,
  ACCOUNT_ROLE_VALUES,
  ACCOUNT_STATUSES,
  ACCOUNT_STATUS_VALUES,
} from "./account.constants.js";

const { Schema, model } = mongoose;

const profileResumeSchema = new Schema(
  {
    fileId: {
      type: String,
      required: [true, "Resume file identifier is required"],
      trim: true,
    },

    fileName: {
      type: String,
      required: [true, "Resume file name is required"],
      trim: true,
    },

    mediaType: {
      type: String,
      required: [true, "Resume media type is required"],
      trim: true,
    },

    size: {
      type: Number,
      required: [true, "Resume file size is required"],
      min: [0, "Resume file size cannot be negative"],
    },

    uploadedAt: {
      type: Date,
      required: [true, "Resume upload time is required"],
      default: Date.now,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const candidateProfileSchema = new Schema(
  {
    phone: {
      type: String,
      trim: true,
      default: null,
    },

    location: {
      type: String,
      trim: true,
      default: null,
    },

    linkedInProfile: {
      type: String,
      trim: true,
      default: null,
    },

    profileResume: {
      type: profileResumeSchema,
      default: undefined,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const recruiterStateSchema = new Schema(
  {
    setupRequired: {
      type: Boolean,
      required: [true, "Recruiter setup state is required"],
      default: true,
    },
  },
  {
    _id: false,
    strict: "throw",
  },
);

const accountSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      immutable: true,
    },

    passwordHash: {
      type: String,
      select: false,
      trim: true,
    },

    role: {
      type: String,
      enum: {
        values: ACCOUNT_ROLE_VALUES,
        message: "Invalid account role: {VALUE}",
      },
      required: [true, "Account role is required"],
      immutable: true,
    },

    status: {
      type: String,
      enum: {
        values: ACCOUNT_STATUS_VALUES,
        message: "Invalid account status: {VALUE}",
      },
      required: [true, "Account status is required"],
      default: ACCOUNT_STATUSES.ACTIVE,
    },

    emailVerified: {
      type: Boolean,
      required: [true, "Email verification state is required"],
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    candidateProfile: {
      type: candidateProfileSchema,
      default: undefined,
    },

    recruiterState: {
      type: recruiterStateSchema,
      default: undefined,
    },
  },
  {
    collection: "accounts",
    timestamps: true,
    strict: "throw",
    minimize: true,
    optimisticConcurrency: true,

    toJSON: {
      virtuals: true,
      transform(_document, returnedObject) {
        delete returnedObject.passwordHash;
        delete returnedObject.__v;

        return returnedObject;
      },
    },

    toObject: {
      virtuals: true,
      transform(_document, returnedObject) {
        delete returnedObject.passwordHash;
        delete returnedObject.__v;

        return returnedObject;
      },
    },
  },
);

accountSchema.index(
  {
    email: 1,
  },
  {
    unique: true,
    name: "uq_accounts_email",
  },
);

accountSchema.index(
  {
    role: 1,
    status: 1,
    createdAt: -1,
    _id: -1,
  },
  {
    name: "idx_accounts_role_status_createdAt_id",
  },
);

accountSchema.virtual("fullName").get(function getFullName() {
  return `${this.firstName} ${this.lastName}`;
});

accountSchema.pre("validate", function validateAccountShape(next) {
  const isCandidate = this.role === ACCOUNT_ROLES.CANDIDATE;
  const isRecruiter = this.role === ACCOUNT_ROLES.RECRUITER;
  const isAdmin = this.role === ACCOUNT_ROLES.RECRUITMENT_ADMIN;

  if (isCandidate) {
    if (this.recruiterState !== undefined) {
      this.invalidate(
        "recruiterState",
        "Candidate account cannot contain recruiter state",
      );
    }

    if (!this.passwordHash) {
      this.invalidate(
        "passwordHash",
        "Candidate account must have a password credential",
      );
    }
  }

  if (isRecruiter) {
    if (this.candidateProfile !== undefined) {
      this.invalidate(
        "candidateProfile",
        "Recruiter account cannot contain candidate profile data",
      );
    }

    if (!this.recruiterState) {
      this.invalidate(
        "recruiterState",
        "Recruiter account must contain recruiter setup state",
      );
    }

    if (this.recruiterState?.setupRequired === false && !this.passwordHash) {
      this.invalidate(
        "passwordHash",
        "Recruiter must have a password after account setup",
      );
    }
  }

  if (isAdmin) {
    if (this.candidateProfile !== undefined) {
      this.invalidate(
        "candidateProfile",
        "Recruitment Admin cannot contain candidate profile data",
      );
    }

    if (this.recruiterState !== undefined) {
      this.invalidate(
        "recruiterState",
        "Recruitment Admin cannot contain recruiter state",
      );
    }

    if (!this.passwordHash) {
      this.invalidate(
        "passwordHash",
        "Recruitment Admin account must have a password credential",
      );
    }
  }

  if (this.emailVerified && !this.emailVerifiedAt) {
    this.invalidate(
      "emailVerifiedAt",
      "Verified account must have an email verification timestamp",
    );
  }

  if (!this.emailVerified && this.emailVerifiedAt) {
    this.invalidate(
      "emailVerifiedAt",
      "Unverified account cannot have an email verification timestamp",
    );
  }

  next();
});

export const Account =
  mongoose.models.Account || model("Account", accountSchema);
