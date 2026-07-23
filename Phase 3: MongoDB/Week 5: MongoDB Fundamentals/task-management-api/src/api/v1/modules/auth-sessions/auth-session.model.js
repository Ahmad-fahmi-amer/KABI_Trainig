import mongoose from "mongoose";

const { Schema, model } = mongoose;

const authSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      select: false,
    },
    expiresAt: { type: Date, required: true, immutable: true },
    revokedAt: { type: Date, default: null },
    replacedBySessionId: {
      type: Schema.Types.ObjectId,
      ref: "AuthSession",
      default: null,
    },
    lastUsedAt: { type: Date, default: null },
    ipAddress: { type: String, default: null, immutable: true },
    userAgent: { type: String, maxlength: 500, default: null, immutable: true },
  },
  { timestamps: true, versionKey: false, collection: "authSessions" },
);

authSessionSchema.index({ userId: 1, revokedAt: 1, createdAt: -1 });
authSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default model("AuthSession", authSessionSchema);
