import { Router } from "express";
import asyncHandler from "../../../../middlewares/core/asyncHandler.js";
import validate from "../../../../middlewares/validation/validation.js";
import { loginSchema } from "./schemas/login.schema.js";
import {
  confirmPasswordResetSchema,
  refreshTokenSchema,
} from "./schemas/token.schema.js";
import {
  confirmPasswordReset,
  login,
  logout,
  refresh,
} from "./auth.controller.js";

const router = Router();
router.post("/login", validate({ body: loginSchema }), asyncHandler(login));
router.post(
  "/refresh",
  validate({ body: refreshTokenSchema }),
  asyncHandler(refresh),
);
router.post(
  "/logout",
  validate({ body: refreshTokenSchema }),
  asyncHandler(logout),
);
router.post(
  "/password-reset/confirm",
  validate({ body: confirmPasswordResetSchema }),
  asyncHandler(confirmPasswordReset),
);
export default router;
