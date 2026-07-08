import { z } from "zod";
import { passwordSchema } from "./user.fields.js";

export const changePasswordSchema = z
  .object({
    currentPassword: passwordSchema,

    newPassword: passwordSchema,

    confirmPassword: passwordSchema,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
