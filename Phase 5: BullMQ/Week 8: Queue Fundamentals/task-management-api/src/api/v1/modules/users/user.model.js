import mongoose from "mongoose";
import ROLES, { ROLE_VALUES } from "../../../../constants/roles.js";
import USER_STATUS, {
  USER_STATUS_VALUES,
} from "../../../../constants/user-status.js";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    email: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true, maxlength: 30, default: null },
    jobTitle: { type: String, trim: true, maxlength: 150, default: null },
    bio: { type: String, trim: true, maxlength: 1000, default: null },
    skills: {
      type: [{ type: String, trim: true, maxlength: 50 }],
      default: [],
      validate: {
        validator(values) {
          const normalized = values.map((value) => value.toLowerCase());
          return (
            values.length <= 30 && new Set(normalized).size === values.length
          );
        },
        message: "Skills must be unique and contain at most 30 entries",
      },
    },
    role: { type: String, required: true, enum: ROLE_VALUES },
    teamId: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    status: {
      type: String,
      required: true,
      enum: USER_STATUS_VALUES,
      default: USER_STATUS.ACTIVE,
    },
    lastLoginAt: { type: Date, default: null },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      immutable: true,
    },
  },
  { timestamps: true, versionKey: false, collection: "users" },
);

userSchema.pre("validate", function validateTeamRequirement() {
  const needsTeam =
    this.status === USER_STATUS.ACTIVE && this.role !== ROLES.SYSTEM_ADMIN;

  if (needsTeam && !this.teamId) {
    this.invalidate("teamId", "Active managers and employees require a team");
  }
});

userSchema.index({ createdAt: -1 });
userSchema.index({ teamId: 1, status: 1, createdAt: -1 });
userSchema.index({ role: 1, status: 1, createdAt: -1 });
userSchema.index({ firstName: "text", lastName: "text", email: "text" });

export default model("User", userSchema);
