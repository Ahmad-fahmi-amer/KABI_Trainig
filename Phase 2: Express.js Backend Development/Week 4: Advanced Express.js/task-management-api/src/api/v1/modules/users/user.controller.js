import { toUserResponse, toUsersResponse } from "./mappers/user.mapper.js";
import userService from "./user.service.js";
// const { id, email } = req.validated.params;
// const { body, query } = req.validated;
// const me = req.user;
export async function getAllUsers(req, res) {
  const users = await userService.getAllUsers();
  return res.success(toUsersResponse(users), "Users retrieved successfully");
}

export async function getUserById(req, res) {
  const user = await userService.getUserById(req.validated.params.id);
  return res.success(toUserResponse(user), "user retrieved successfully");
}

export async function getUserByEmail(req, res) {
  const user = await userService.getUserByEmail(req.validated.params.email);
  return res.success(toUserResponse(user), "user retrieved successfully");
}

export async function createUser(req, res) {
  const user = await userService.createUser(req.validated.body);
  return res.created(toUserResponse(user), "User created successfully");
}

export async function updateUser(req, res) {
  const user = await userService.updateUser(
    req.validated.params.id,
    req.validated.body,
  );
  res.success(toUserResponse(user), "user updated successfully");
}

export async function deleteUser(req, res) {
  await userService.deleteUser(req.validated.params.id);
  return res.noContent();
}

export async function getMe(req, res) {
  const user = await userService.getUserById(req.user.id);
  return res.success(toUserResponse(user), "user retrieved successfully");
}

export async function deleteMe(req, res) {
  await userService.deleteUser(req.user.id);
  return res.noContent();
}

export async function updateMe(req, res) {
  const user = await userService.updateUser(req.user.id, req.validated.body);
  return res.success(toUserResponse(user), "user updated successfully");
}

export async function changePassword(req, res) {
  const user = await userService.changePassword(
    req.user.id,
    req.validated.body,
  );
  return res.success(toUserResponse(user), "password changed successfully");
}
