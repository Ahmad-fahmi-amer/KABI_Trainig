import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
} from "./user.controller.js";
import validate from "../../../../middlewares/validation/validation.js";
import asyncHandler from "../../../../middlewares/asyncHandler.js";
import { createUserSchema } from "./schemas/create-user.schema.js";
import { updateUserSchema } from "./schemas/update-user.schema.js";
import { userIdSchema } from "./schemas/user-id.schema.js";
import { emailSchema } from "./schemas/user.base.schema.js";

const router = Router();

router.get("/", asyncHandler(getAllUsers));

router.get(
  "/email/:email",
  validate({ params: emailSchema }),
  asyncHandler(getUserByEmail),
);

router.get(
  "/:id",
  validate({ params: userIdSchema }),
  asyncHandler(getUserById),
);

router.post(
  "/",
  validate({ body: createUserSchema }),
  asyncHandler(createUser),
);

router.put(
  "/:id",
  validate({ params: userIdSchema, body: updateUserSchema }),
  asyncHandler(updateUser),
);

router.delete(
  "/:id",
  validate({ params: userIdSchema }),
  asyncHandler(deleteUser),
);

export default router;
