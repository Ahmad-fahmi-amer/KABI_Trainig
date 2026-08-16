import mongoose from "mongoose";

import { AUTH_SESSION_REVOCATION_REASON_VALUES } from "./auth-session.constants.js";

const { Schema, model } = mongoose;

const authSessionSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Session account identifier is required"],
      immutable: true,
    },

    refreshTokenHash: {
      type: String,
      required: [true, "Refresh token hash is required"],
      select: false,
    },

    expiresAt: {
      type: Date,
      required: [true, "Session expiration is required"],
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revocationReason: {
      type: String,
      enum: {
        values: [...AUTH_SESSION_REVOCATION_REASON_VALUES, null],
        message: "Invalid session revocation reason: {VALUE}",
      },
      default: null,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    rotatedAt: {
      type: Date,
      default: null,
    },

    ipAddress: {
      type: String,
      trim: true,
      default: null,
      select: false,
    },

    userAgent: {
      type: String,
      trim: true,
      default: null,
      select: false,
    },
  },
  {
    collection: "authSessions",
    timestamps: true,
    strict: "throw",
    minimize: true,
    optimisticConcurrency: true,

    toJSON: {
      transform(_document, returnedObject) {
        delete returnedObject.refreshTokenHash;
        delete returnedObject.ipAddress;
        delete returnedObject.userAgent;
        delete returnedObject.__v;
        return returnedObject;
      },
    },

    toObject: {
      transform(_document, returnedObject) {
        delete returnedObject.refreshTokenHash;
        delete returnedObject.ipAddress;
        delete returnedObject.userAgent;
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

authSessionSchema.pre("validate", function validateAuthSessionState() {
  if (
    this.expiresAt instanceof Date &&
    this.createdAt instanceof Date &&
    this.expiresAt <= this.createdAt
  ) {
    this.invalidate(
      "expiresAt",
      "Session expiration must be later than creation",
    );
  }

  if (this.revokedAt && !this.revocationReason) {
    this.invalidate(
      "revocationReason",
      "Revoked Session must include a revocation reason",
    );
  }

  if (!this.revokedAt && this.revocationReason) {
    this.invalidate(
      "revocationReason",
      "Active Session cannot include a revocation reason",
    );
  }
});

authSessionSchema.virtual("isRevoked").get(function getIsRevoked() {
  return Boolean(this.revokedAt);
});

authSessionSchema.virtual("isExpired").get(function getIsExpired() {
  return this.expiresAt.getTime() <= Date.now();
});

authSessionSchema.virtual("isActive").get(function getIsActive() {
  return !this.revokedAt && this.expiresAt.getTime() > Date.now();
});

authSessionSchema.index(
  {
    accountId: 1,
    revokedAt: 1,
  },
  {
    name: "idx_authSessions_account_revokedAt",
  },
);

authSessionSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
    name: "ttl_authSessions_expiresAt",
  },
);

export const AuthSession =
  mongoose.models.AuthSession || model("AuthSession", authSessionSchema);
