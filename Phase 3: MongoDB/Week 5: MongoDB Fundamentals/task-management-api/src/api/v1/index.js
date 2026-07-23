import { Router } from "express";
const router = Router();
import taskRouter from "./modules/tasks/task.routes.js";
import userRouter from "./modules/users/user.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import teamRouter from "./modules/teams/team.routes.js";
import notificationRouter from "./modules/notifications/notification.routes.js";
import activityLogRouter from "./modules/activity-logs/activity-log.routes.js";

router.use("/tasks", taskRouter);
router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/teams", teamRouter);
router.use("/notifications", notificationRouter);
router.use("/activity-logs", activityLogRouter);

export default router;
