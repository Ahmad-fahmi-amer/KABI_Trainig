import { z } from "zod";
import { TASK_PRIORITY_VALUES, TASK_STATUS_VALUES } from "../../../../../constants/task.js";
import { objectIdSchema } from "../../users/schemas/user.fields.js";

export const titleSchema = z.string().trim().min(3).max(150);
export const taskBaseSchema = z.object({
  title: titleSchema,
  description: z.string().trim().max(5000).nullable().optional(),
  priority: z.enum(TASK_PRIORITY_VALUES).optional(),
  dueDate: z.coerce.date(),
  assigneeId: objectIdSchema,
  teamId: objectIdSchema,
});
export const taskStatusSchema = z.object({ status: z.enum(TASK_STATUS_VALUES) });
