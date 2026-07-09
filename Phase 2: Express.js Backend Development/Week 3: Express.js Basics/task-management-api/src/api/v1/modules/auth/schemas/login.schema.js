import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
} from "../../users/schemas/user.base.schema.js";

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
