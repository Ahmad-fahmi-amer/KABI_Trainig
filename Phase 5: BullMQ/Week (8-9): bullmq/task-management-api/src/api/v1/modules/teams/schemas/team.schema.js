import { z } from "zod";
import { objectIdSchema } from "../../users/schemas/user.fields.js";

export const teamIdSchema = z.object({ id: objectIdSchema });
export const createTeamSchema = z.object({ name: z.string().trim().min(2).max(100), managerId: objectIdSchema });
export const updateTeamSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  managerId: objectIdSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
export const listTeamsSchema = z.object({
  search: z.string().trim().max(100).optional(), page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.enum(["name", "createdAt"]).default("createdAt"),
  sortOrder: z.enum(["ASC", "DESC"]).default("DESC"),
});
