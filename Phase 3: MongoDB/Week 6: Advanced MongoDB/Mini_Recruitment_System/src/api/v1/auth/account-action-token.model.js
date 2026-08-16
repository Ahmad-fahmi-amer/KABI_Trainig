import mongoose from "mongoose";

import { ACCOUNT_ACTION_TOKEN_TYPE_VALUES } from "./account-action-token.constants.js";

const { Schema, model } = mongoose;

const accountActionTokenSchema = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Token account identifier is required"],
      immutable: true,
    },

    type: {
      type: String,
      enum: {
        values: ACCOUNT_ACTION_TOKEN_TYPE_VALUES,
        message: "Invalid Account Action Token type: {VALUE}",
      },
      required: [true, "Account Action Token type is required"],
      immutable: true,
    },

    tokenHash: {
      type: String,
      required: [true, "Account Action Token hash is required"],
      immutable: true,
      select: false,
    },

    expiresAt: {
      type: Date,
      required: [true, "Account Action Token expiration is required"],
      immutable: true,
    },

    consumedAt: {
      type: Date,
      default: null,
    },
  },
  {
    collection: "accountActionTokens",
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    strict: "throw",
    minimize: true,

    toJSON: {
      transform(_document, returnedObject) {
        delete returnedObject.tokenHash;
        delete returnedObject.__v;
        return returnedObject;
      },
    },

    toObject: {
      transform(_document, returnedObject) {
        delete returnedObject.tokenHash;
        delete returnedObject.__v;
        return returnedObject;
      },
    },
  },
);

accountActionTokenSchema.pre("validate", function validateActionTokenState() {
  if (
    this.expiresAt instanceof Date &&
    this.createdAt instanceof Date &&
    this.expiresAt <= this.createdAt
  ) {
    this.invalidate(
      "expiresAt",
      "Token expiration must be later than creation",
    );
  }

  if (this.consumedAt && this.createdAt && this.consumedAt < this.createdAt) {
    this.invalidate("consumedAt", "Token consumption cannot precede creation");
  }
});

accountActionTokenSchema.virtual("isConsumed").get(function getIsConsumed() {
  return Boolean(this.consumedAt);
});

accountActionTokenSchema.virtual("isExpired").get(function getIsExpired() {
  return this.expiresAt.getTime() <= Date.now();
});

accountActionTokenSchema.virtual("isUsable").get(function getIsUsable() {
  return !this.consumedAt && this.expiresAt.getTime() > Date.now();
});

accountActionTokenSchema.index(
  {
    tokenHash: 1,
    type: 1,
  },
  {
    unique: true,
    name: "uq_accountActionTokens_hash_type",
  },
);

accountActionTokenSchema.index(
  {
    accountId: 1,
    type: 1,
    consumedAt: 1,
  },
  {
    name: "idx_accountActionTokens_account_type_consumedAt",
  },
);

accountActionTokenSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
    name: "ttl_accountActionTokens_expiresAt",
  },
);

export const AccountActionToken =
  mongoose.models.AccountActionToken ||
  model("AccountActionToken", accountActionTokenSchema);
