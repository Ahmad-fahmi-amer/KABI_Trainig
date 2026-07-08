import { z } from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name must be at least 1 characters.")
  .max(50, "Name must not exceed 50 characters.");

export const emailSchema = z.string().trim().email("Invalid email address.");

export const passwordSchema = z
  .string()
  .min(1, "Password must be at least 1 characters.")
  .max(100, "Password must not exceed 100 characters.");

export const userBaseSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});
