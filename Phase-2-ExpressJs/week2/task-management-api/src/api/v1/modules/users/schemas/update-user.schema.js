import { z } from "zod";
import { nameSchema, emailSchema, roleSchema } from "./user.fields.js";

export const updateUserSchema = z.object({
  name: nameSchema.optional(),

  email: emailSchema.optional(),

  role: roleSchema.optional(),
});
