import {
  toAuthResponse,
  toUserResponse,
} from "../users/mappers/user.mapper.js";
import authService from "./auth.service.js";

export async function login(req, res) {
  const user = await authService.login(req.validated.body);

  res.success(toAuthResponse(user), "logged in successfully");
}

export async function register(req, res) {
  const user = await authService.register(req.validated.body);

  res.created(toUserResponse(user), "user created sucessfully");
}
