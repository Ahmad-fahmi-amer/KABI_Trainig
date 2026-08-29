import { z } from "zod";
import { objectIdSchema } from "./user.fields.js";

export const userIdSchema = z.object({ id: objectIdSchema });
