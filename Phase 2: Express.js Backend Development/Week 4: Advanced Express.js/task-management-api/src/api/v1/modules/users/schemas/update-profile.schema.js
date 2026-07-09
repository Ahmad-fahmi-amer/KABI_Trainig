import { z } from "zod";
import { nameSchema, emailSchema } from "./user.fields.js";

export const updateProfileSchema = z.object({
  name: nameSchema.optional(),

  email: emailSchema.optional(),
});
