import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  passwordSchema,
  roleSchema,
} from "./user.fields.js";

export const createUserSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema.optional(),
});
