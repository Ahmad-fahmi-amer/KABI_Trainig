import { toUserResponse, toUsersResponse } from "./mappers/user.mapper.js";
import userService from "./user.service.js";

export async function getAllUsers(req, res) {
  return res.success(
    toUsersResponse(
      await userService.getAllUsers(req.validated.query, req.user),
    ),
  );
}
export async function getUserById(req, res) {
  return res.success(
    toUserResponse(await userService.getUserById(req.validated.params.id)),
  );
}
export async function createUser(req, res) {
  const user = await userService.createUser(req.validated.body, req.user, {
    requestId: req.requestId,
  });
  return res.created(toUserResponse(user), "User created successfully");
}
export async function updateUser(req, res) {
  const user = await userService.updateUser(
    req.validated.params.id,
    req.validated.body,
    req.user,
    { requestId: req.requestId },
  );
  return res.success(toUserResponse(user), "User updated successfully");
}
export async function getMe(req, res) {
  return res.success(
    toUserResponse(await userService.getUserById(req.user._id)),
  );
}
export async function updateMe(req, res) {
  return res.success(
    toUserResponse(
      await userService.updateProfile(req.user._id, req.validated.body),
    ),
  );
}
export async function changePassword(req, res) {
  await userService.changePassword(req.user._id, req.validated.body);
  return res.noContent();
}
export async function resetPassword(req, res) {
  await userService.resetPassword(
    req.validated.params.id,
    req.validated.body.newPassword,
    req.user,
  );
  return res.noContent();
}
export async function issuePasswordResetToken(req, res) {
  return res.created(
    await userService.issuePasswordResetToken(
      req.validated.params.id,
      req.user,
    ),
    "Password reset token created; it will only be returned once",
  );
}
