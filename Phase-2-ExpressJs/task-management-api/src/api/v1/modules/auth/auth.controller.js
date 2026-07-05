import authService from "./auth.service.js";

export async function login(req, res, next) {
  try {
    const user = await authService.login(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
}

export async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
