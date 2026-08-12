import { z } from "zod";

export const refreshTokenSchema = z.object({ refreshToken: z.string().min(1) });
export const confirmPasswordResetSchema = z.object({
  token: z.string().length(64), newPassword: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match", path: ["confirmPassword"],
});
