import { Router } from "express";
const router = Router();
import taskRouter from "./modules/tasks/task.routes.js";
import userRouter from "./modules/users/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
router.use("/tasks", taskRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);

export default router;
