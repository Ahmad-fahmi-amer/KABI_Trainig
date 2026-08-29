import { z } from "zod";
import {
  emailSchema,
  firstNameSchema,
  lastNameSchema,
  objectIdSchema,
  passwordSchema,
  phoneSchema,
  roleSchema,
  statusSchema,
} from "./user.fields.js";

export const createUserSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  phone: phoneSchema.optional(),
  teamId: objectIdSchema.nullable().optional(),
  role: roleSchema,
  status: statusSchema.optional(),
});
