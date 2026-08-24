import { z } from "zod";
import { objectIdSchema } from "../../users/schemas/user.fields.js";

export const taskIdSchema = z.object({ id: objectIdSchema });
export const taskChildIdSchema = z.object({ id: objectIdSchema, childId: objectIdSchema });
