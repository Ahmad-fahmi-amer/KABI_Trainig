import { Router } from "express";
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateUser,
} from "./user.controller.js";
import { validateUpdateUser } from "./middleware/validateUpdateUser.middleware.js";
import { validateCreateUser } from "./middleware/validateCreateUser.middleware.js";
const router = Router();

router.get("/", getAllUsers);

router.get("/email/:email", getUserByEmail);

router.get("/:id", getUserById);

router.post("/", validateCreateUser, createUser);

router.put("/:id", validateUpdateUser, updateUser);

router.delete("/:id", deleteUser);

export default router;
