import { z } from "zod";

export const titleSchema = z
  .string()
  .trim()
  .min(3, "Title must be at least 3 characters.")
  .max(255, "Title must not exceed 255 characters.");

export const taskBaseSchema = z.object({
  title: titleSchema,
});
