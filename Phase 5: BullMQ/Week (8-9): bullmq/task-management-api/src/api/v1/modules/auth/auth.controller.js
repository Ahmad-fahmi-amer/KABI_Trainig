import { toAuthResponse } from "../users/mappers/user.mapper.js";
import authService from "./auth.service.js";

function requestContext(req) {
  return {
    ip: req.ip,
    userAgent: req.get("user-agent"),
    requestId: req.requestId,
  };
}

export async function login(req, res) {
  const result = await authService.login(
    req.validated.body,
    requestContext(req),
  );
  return res.success(toAuthResponse(result), "Logged in successfully");
}

export async function refresh(req, res) {
  const result = await authService.refresh(
    req.validated.body.refreshToken,
    requestContext(req),
  );
  return res.success(toAuthResponse(result), "Token refreshed successfully");
}

export async function logout(req, res) {
  await authService.logout(
    req.validated.body.refreshToken,
    requestContext(req),
  );
  return res.noContent();
}
export async function confirmPasswordReset(req, res) {
  await authService.confirmPasswordReset(
    req.validated.body.token,
    req.validated.body.newPassword,
  );
  return res.noContent();
}
