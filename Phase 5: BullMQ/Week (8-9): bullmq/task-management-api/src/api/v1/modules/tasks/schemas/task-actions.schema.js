import { z } from "zod";
import {
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
} from "../../../../../constants/task.js";
import { objectIdSchema } from "../../users/schemas/user.fields.js";
export const listTasksSchema = z.object({
  assigneeId: objectIdSchema.optional(),
  teamId: objectIdSchema.optional(),
  status: z.enum(TASK_STATUS_VALUES).optional(),
  priority: z.enum(TASK_PRIORITY_VALUES).optional(),
  overdue: z.stringbool().default(false),
  search: z.string().trim().max(100).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export const statusSchema = z.object({ status: z.enum(TASK_STATUS_VALUES) });
export const commentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});
export const attachmentSchema = z.object({
  fileName: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().min(1).max(100),
  size: z.coerce
    .number()
    .int()
    .positive()
    .max(25 * 1024 * 1024),
  storageKey: z.string().trim().min(1).max(512),
});
