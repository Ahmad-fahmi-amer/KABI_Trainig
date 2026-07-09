import { z } from "zod";
import ROLES from "../../../../../constants/roles.js";
import { userBaseSchema } from "./user.base.schema.js";

export const createUserSchema = userBaseSchema.extend({
  role: z.enum([ROLES.ADMIN, ROLES.USER]),
});
