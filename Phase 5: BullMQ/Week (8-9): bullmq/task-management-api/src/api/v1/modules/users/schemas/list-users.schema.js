import { z } from "zod";
import { objectIdSchema, roleSchema, statusSchema } from "./user.fields.js";

export const listUsersSchema = z.object({
  search: z.string().trim().max(100).optional(),
  role: roleSchema.optional(),
  teamId: objectIdSchema.optional(),
  status: statusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["createdAt", "firstName", "lastName"]).default("createdAt"),
  sortOrder: z.enum(["ASC", "DESC"]).default("DESC"),
});
