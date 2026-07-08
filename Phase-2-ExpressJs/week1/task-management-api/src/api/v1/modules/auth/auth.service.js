import { NotFoundError } from "../../../../errors/index.js";
import userService from "../users/user.service.js";

async function login(data) {
  const { email, password } = data;
  const user = await userService.findByEmail(email);
  if (!user) {
    throw new NotFoundError("invalid email or password");
  }
  if (user.password !== password) {
    throw new NotFoundError("invalid email or password");
  }
  return user;
}
async function register(data) {
  return await userService.create(data);
}

const authService = { login, register };

export default authService;
