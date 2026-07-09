import userService from "./user.service.js";

export async function getAllUsers(req, res) {
  const users = await userService.findAll();
  return res.success(users, "Users retrieved successfully");
}

export async function getUserById(req, res) {
  const user = await userService.findById(Number(req.params.id));
  return res.success(user, "user retrieved successfully");
}

export async function getUserByEmail(req, res) {
  const user = await userService.findByEmail(req.params.email);
  return res.success(user, "user retrieved successfully");
}

export async function createUser(req, res) {
  const user = await userService.create(req.body);
  return res.created(user, "User created successfully");
}

export async function updateUser(req, res) {
  const user = await userService.update(Number(req.params.id), req.body);
  res.success(user, "user updated successfully");
}

export async function deleteUser(req, res) {
  await userService.remove(Number(req.params.id));
  return res.noContent();
}
