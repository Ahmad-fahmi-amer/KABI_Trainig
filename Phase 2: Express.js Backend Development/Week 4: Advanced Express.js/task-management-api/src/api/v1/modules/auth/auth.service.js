import { ForbiddenError, NotFoundError } from "../../../../errors/index.js";
import userService from "../users/user.service.js";
import bcrypt from "bcrypt";
import tokenService from "./token.service.js";
async function login(data) {
  const { email, password } = data;
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new NotFoundError("invalid credentials");
  }

  await userService.comparePassword(password, user.password);
  const payload = {
    id: user.id,
    role: user.role,
  };

  if (!user.isActive) {
    throw new ForbiddenError("user was deleted");
  }

  const accessToken = tokenService.generateAccessToken(payload);

  const refreshToken = tokenService.generateRefreshToken(payload);

  await userService.updateMetaData(user.id, {
    lastLoginAt: new Date(),
  });
  return { accessToken, refreshToken, user };
}
async function register(data) {
  return await userService.createUser(data);
}

const authService = { login, register };

export default authService;
