import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
  getTaskByUserId,
} from "./task.controller.js";

import asyncHandler from "../../../../middlewares/asyncHandler.js";
import validate from "../../../../middlewares/validation/validation.js";
import { taskIdSchema } from "./schemas/task-id.schema.js";
import { userIdSchema } from "../users/schemas/user-id.schema.js";
import { createTaskSchema } from "./schemas/create-task.schema.js";
import { updateTaskSchema } from "./schemas/update-task.schema.js";

const router = Router();

router.get("/", asyncHandler(getAllTasks));

router.get(
  "/:id",
  validate({ params: taskIdSchema }),
  asyncHandler(getTaskById),
);

router.get(
  "/user/:id",
  validate({ params: userIdSchema }),
  asyncHandler(getTaskByUserId),
);

router.post(
  "/",
  validate({ body: createTaskSchema }),
  asyncHandler(createTask),
);

router.patch(
  "/:id",
  validate({ params: taskIdSchema, body: updateTaskSchema }),
  asyncHandler(updateTask),
);

router.delete(
  "/:id",
  validate({ params: taskIdSchema }),
  asyncHandler(deleteTask),
);

export default router;
