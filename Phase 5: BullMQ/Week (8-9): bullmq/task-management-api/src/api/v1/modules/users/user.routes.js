import { Router } from "express";
import ROLES from "../../../../constants/roles.js";
import protect from "../../../../middlewares/auth/auth.middleware.js";
import authorize from "../../../../middlewares/auth/authorize.middleware.js";
import asyncHandler from "../../../../middlewares/core/asyncHandler.js";
import validate from "../../../../middlewares/validation/validation.js";
import {
  changePasswordSchema,
  resetPasswordSchema,
} from "./schemas/change-password.schema.js";
import { createUserSchema } from "./schemas/create-user.schema.js";
import { listUsersSchema } from "./schemas/list-users.schema.js";
import { updateProfileSchema } from "./schemas/update-profile.schema.js";
import { updateUserSchema } from "./schemas/update-user.schema.js";
import { userIdSchema } from "./schemas/user-id.schema.js";
import {
  changePassword,
  createUser,
  getAllUsers,
  getMe,
  getUserById,
  issuePasswordResetToken,
  resetPassword,
  updateMe,
  updateUser,
} from "./user.controller.js";

const router = Router();
router.use(protect);
router.get("/me", asyncHandler(getMe));
router.patch(
  "/me",
  validate({ body: updateProfileSchema }),
  asyncHandler(updateMe),
);
router.patch(
  "/me/password",
  validate({ body: changePasswordSchema }),
  asyncHandler(changePassword),
);
router.get(
  "/",
  authorize(ROLES.SYSTEM_ADMIN, ROLES.TEAM_MANAGER),
  validate({ query: listUsersSchema }),
  asyncHandler(getAllUsers),
);
router.post(
  "/",
  authorize(ROLES.SYSTEM_ADMIN),
  validate({ body: createUserSchema }),
  asyncHandler(createUser),
);
router.get(
  "/:id",
  authorize(ROLES.SYSTEM_ADMIN),
  validate({ params: userIdSchema }),
  asyncHandler(getUserById),
);
router.patch(
  "/:id",
  authorize(ROLES.SYSTEM_ADMIN),
  validate({ params: userIdSchema, body: updateUserSchema }),
  asyncHandler(updateUser),
);
router.patch(
  "/:id/password-reset",
  authorize(ROLES.SYSTEM_ADMIN),
  validate({ params: userIdSchema, body: resetPasswordSchema }),
  asyncHandler(resetPassword),
);
router.post(
  "/:id/password-reset-token",
  authorize(ROLES.SYSTEM_ADMIN),
  validate({ params: userIdSchema }),
  asyncHandler(issuePasswordResetToken),
);
export default router;
