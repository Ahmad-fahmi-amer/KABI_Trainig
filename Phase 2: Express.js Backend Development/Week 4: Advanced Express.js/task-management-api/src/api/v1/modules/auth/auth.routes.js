import { Router } from "express";
import { login, register } from "./auth.controller.js";

import asyncHandler from "../../../../middlewares/core/asyncHandler.js";
import validate from "../../../../middlewares/validation/validation.js";
import { loginSchema } from "./schemas/login.schema.js";
import { registerSchema } from "./schemas/register.schema.js";

const router = Router();

router.post("/login", validate({ body: loginSchema }), asyncHandler(login));

router.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(register),
);

export default router;
//  user.fields.js
// │   ├── register.schema.js
// │   ├── login.schema.js
// │   ├── create-user.schema.js
// │   ├── update-user.schema.js
// │   ├── update-profile.schema.js
// │   ├── change-password.schema.js
// │   └── user-id.schema.js
