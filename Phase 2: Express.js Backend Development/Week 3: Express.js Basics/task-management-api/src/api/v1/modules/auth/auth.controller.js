import authService from "./auth.service.js";

export async function login(req, res) {
  const user = await authService.login(req.body);

  res.success(user, "logged in successfully");
}

export async function register(req, res) {
  const user = await authService.register(req.body);

  res.created(user, "user created sucessfully");
}
