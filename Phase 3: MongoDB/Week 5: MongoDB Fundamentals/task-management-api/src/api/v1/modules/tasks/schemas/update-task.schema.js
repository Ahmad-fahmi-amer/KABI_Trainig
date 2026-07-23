import { taskBaseSchema } from "./task.base.schema.js";

export const updateTaskSchema = taskBaseSchema.omit({ teamId: true }).partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required");
