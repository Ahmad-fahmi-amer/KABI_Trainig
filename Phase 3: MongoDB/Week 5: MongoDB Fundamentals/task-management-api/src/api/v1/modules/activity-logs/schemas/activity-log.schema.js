import { z } from "zod";
import {
  ACTIVITY_ACTION_VALUES,
  ACTIVITY_ENTITY_TYPE_VALUES,
} from "../../../../../constants/activity.js";
import { objectIdSchema } from "../../users/schemas/user.fields.js";
export const listActivityLogsSchema = z.object({
  actorId: objectIdSchema.optional(),
  entityType: z.enum(ACTIVITY_ENTITY_TYPE_VALUES).optional(),
  entityId: objectIdSchema.optional(),
  action: z.enum(ACTIVITY_ACTION_VALUES).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
