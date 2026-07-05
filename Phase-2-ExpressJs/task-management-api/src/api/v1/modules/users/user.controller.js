import userService from "./user.service.js";

export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
}
export async function getUserById(req, res, next) {
  try {
    const user = await userService.findById(Number(req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
}
export async function getUserByEmail(req, res, next) {
  try {
    const user = await userService.findByEmail(req.params.email);
    res.json(user);
  } catch (error) {
    next(error);
  }
}
export async function createUser(req, res, next) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}
export async function updateUser(req, res, next) {
  try {
    const user = await userService.update(Number(req.params.id), req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
}
export async function deleteUser(req, res, next) {
  try {
    const user = await userService.remove(Number(req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
}
