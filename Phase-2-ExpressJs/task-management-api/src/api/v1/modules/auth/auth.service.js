import userService from "../users/user.service.js";

async function login(data) {
  const { email, password } = data;
  const user = await userService.findByEmail(email);
  if (!user) {
    const error = new Error("invalid email or password");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }
  if (user.password !== password) {
    const error = new Error("invalid email or password");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }
  return user;
}
async function register(data) {
  return await userService.create(data);
}

const authService = { login, register };

export default authService;
