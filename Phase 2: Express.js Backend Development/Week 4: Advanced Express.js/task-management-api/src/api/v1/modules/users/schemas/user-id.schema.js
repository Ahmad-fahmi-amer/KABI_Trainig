import { z } from "zod";

export const userIdSchema = z.object({
  id: z.coerce
    .number()
    .int("User id must be integer")
    .positive("User id must be positive"),
});
