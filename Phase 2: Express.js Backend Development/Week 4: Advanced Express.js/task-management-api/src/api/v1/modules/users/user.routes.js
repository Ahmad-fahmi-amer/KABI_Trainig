import { Router } from "express";
import {
  changePassword,
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getMe,
  getUserByEmail,
  getUserById,
  updateMe,
  updateUser,
} from "./user.controller.js";
import validate from "../../../../middlewares/validation/validation.js";
import asyncHandler from "../../../../middlewares/core/asyncHandler.js";

import protect from "../../../../middlewares/auth/auth.middleware.js";
import authorize from "../../../../middlewares/auth/authorize.middleware.js";

import ROLES from "../../../../constants/roles.js";
import { updateProfileSchema } from "./schemas/update-profile.schema.js";
import { changePasswordSchema } from "./schemas/change-password.schema.js";
import { emailParamSchema, emailSchema } from "./schemas/user.fields.js";
import { userIdSchema } from "./schemas/user-id.schema.js";
import { createUserSchema } from "./schemas/create-user.schema.js";
import { updateUserSchema } from "./schemas/update-user.schema.js";

const router = Router();
// current User
router.get("/me", protect, asyncHandler(getMe));

router.patch(
  "/me",
  protect,
  validate({ body: updateProfileSchema }),
  asyncHandler(updateMe),
);

router.delete("/me", protect, asyncHandler(deleteMe));

router.patch(
  "/me/password",
  protect,
  validate(changePasswordSchema),
  asyncHandler(changePassword),
);
// ----------------------------------------------------------- //
// Admin
router.get("/", protect, authorize(ROLES.ADMIN), asyncHandler(getAllUsers));

router.get(
  "/email/:email",
  // protect,
  // authorize(ROLES.ADMIN),
  validate({ params: emailParamSchema }),
  asyncHandler(getUserByEmail),
);

router.get(
  "/:id",
  protect,
  authorize(ROLES.ADMIN),
  validate({ params: userIdSchema }),
  asyncHandler(getUserById),
);

router.post(
  "/",
  protect,
  authorize(ROLES.ADMIN),
  validate({ body: createUserSchema }),
  asyncHandler(createUser),
);

router.patch(
  "/:id",
  protect,
  authorize(ROLES.ADMIN),
  validate({ params: userIdSchema, body: updateUserSchema }),
  asyncHandler(updateUser),
);

router.delete(
  "/:id",
  protect,
  authorize(ROLES.ADMIN),
  validate({ params: userIdSchema }),
  asyncHandler(deleteUser),
);
export default router;
