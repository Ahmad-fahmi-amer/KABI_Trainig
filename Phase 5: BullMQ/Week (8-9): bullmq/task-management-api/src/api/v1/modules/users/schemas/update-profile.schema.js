import { z } from "zod";
import { firstNameSchema, lastNameSchema, phoneSchema } from "./user.fields.js";

export const updateProfileSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  phone: phoneSchema.nullable().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one field is required");
