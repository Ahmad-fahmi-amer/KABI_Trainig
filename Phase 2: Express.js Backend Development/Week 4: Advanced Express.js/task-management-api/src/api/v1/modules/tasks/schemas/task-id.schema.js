import { z } from "zod";

export const taskIdSchema = z.object({
  id: z.coerce
    .number()
    .int("Task id must be an integer.")
    .positive("Task id must be positive."),
});
