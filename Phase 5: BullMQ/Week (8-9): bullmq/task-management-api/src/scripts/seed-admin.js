import bcrypt from "bcrypt";
import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../config/database.js";
import { env } from "../config/env.js";
import ROLES from "../constants/roles.js";
import USER_STATUS from "../constants/user-status.js";
import User from "../api/v1/modules/users/user.model.js";

const required = [
  "BOOTSTRAP_ADMIN_FIRST_NAME",
  "BOOTSTRAP_ADMIN_LAST_NAME",
  "BOOTSTRAP_ADMIN_EMAIL",
  "BOOTSTRAP_ADMIN_PASSWORD",
];
for (const key of required)
  if (!env[key])
    throw new Error(`Missing required environment variable: ${key}`);
if (env.BOOTSTRAP_ADMIN_PASSWORD.length < 12)
  throw new Error("Bootstrap password must contain at least 12 characters");

try {
  await connectToDatabase();
  if (await User.exists({ email: env.BOOTSTRAP_ADMIN_EMAIL.toLowerCase() })) {
    throw new Error("Bootstrap administrator already exists");
  }
  await User.create({
    firstName: env.BOOTSTRAP_ADMIN_FIRST_NAME,
    lastName: env.BOOTSTRAP_ADMIN_LAST_NAME,
    email: env.BOOTSTRAP_ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(env.BOOTSTRAP_ADMIN_PASSWORD, 12),
    role: ROLES.SYSTEM_ADMIN,
    status: USER_STATUS.ACTIVE,
    createdBy: null,
  });
  console.log("System administrator created successfully");
} finally {
  await disconnectFromDatabase();
}
