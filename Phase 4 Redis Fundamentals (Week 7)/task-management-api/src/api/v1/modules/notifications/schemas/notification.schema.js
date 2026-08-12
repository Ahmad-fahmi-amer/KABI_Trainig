import { z } from "zod";
import { objectIdSchema } from "../../users/schemas/user.fields.js";
export const notificationIdSchema = z.object({ id: objectIdSchema });
export const listNotificationsSchema = z.object({
  unreadOnly: z.stringbool().default(false),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
