import { z } from "zod";
import {
  firstNameSchema,
  lastNameSchema,
  objectIdSchema,
  phoneSchema,
  roleSchema,
  statusSchema,
} from "./user.fields.js";

export const updateUserSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.nullable().optional(),
  teamId: objectIdSchema.nullable().optional(),
  role: roleSchema.optional(),
  status: statusSchema.optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
