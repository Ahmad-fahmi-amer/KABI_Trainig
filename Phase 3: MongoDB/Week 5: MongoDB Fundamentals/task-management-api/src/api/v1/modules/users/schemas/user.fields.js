import { z } from "zod";
import ROLES from "../../../../../constants/roles.js";

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Name must be at least 2 characters")
  .max(50, "Name must not exceed 50 characters");

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(1, "Password must be at least 8 characters")
  .max(100, "Password must not exceed 100 characters");

export const roleSchema = z.enum([ROLES.ADMIN, ROLES.USER]);
export const emailParamSchema = z.object({
  email: emailSchema,
});
