import { Router } from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  deleteTask,
  updateTask,
  getTaskByUserId,
} from "./task.controller.js";
import { validateCreateTask } from "./middleware/validateCreateTask.middleware.js";
import { validateUpdateTask } from "./middleware/validateUpdateTask.middleware.js";

const router = Router();

router.get("/", getAllTasks);

router.get("/:id", getTaskById);

router.get("/user/:id", getTaskByUserId);

router.post("/", validateCreateTask, createTask);

router.patch("/:id", validateUpdateTask, updateTask);

router.delete("/:id", deleteTask);

export default router;
