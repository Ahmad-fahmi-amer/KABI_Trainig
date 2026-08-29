import { z } from "zod";
import { ROLE_VALUES } from "../../../../../constants/roles.js";
import { USER_STATUS_VALUES } from "../../../../../constants/user-status.js";

export const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");
export const firstNameSchema = z.string().trim().min(1).max(50);
export const lastNameSchema = z.string().trim().min(1).max(50);
export const emailSchema = z.string().trim().email().max(254).toLowerCase();
export const phoneSchema = z.string().trim().min(7).max(30);
export const passwordSchema = z.string().min(8).max(100);
export const roleSchema = z.enum(ROLE_VALUES);
export const statusSchema = z.enum(USER_STATUS_VALUES);
