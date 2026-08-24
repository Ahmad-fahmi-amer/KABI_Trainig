import mongoose from "mongoose";
const { Schema, model } = mongoose;
const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      select: false,
      immutable: true,
    },
    expiresAt: { type: Date, required: true, immutable: true },
    usedAt: { type: Date, default: null },
    revokedAt: { type: Date, default: null },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "passwordResetTokens" },
);
schema.index({ userId: 1, createdAt: -1 });
schema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default model("PasswordResetToken", schema);
