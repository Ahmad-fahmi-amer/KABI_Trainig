import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  passwordSchema,
} from "../../users/schemas/user.fields.js";

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
