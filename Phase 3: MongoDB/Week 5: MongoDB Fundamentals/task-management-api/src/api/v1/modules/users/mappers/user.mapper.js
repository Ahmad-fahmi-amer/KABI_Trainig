export function toUserResponse(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
export function toUsersResponse(users) {
  return users.map(toUserResponse);
}
export function toAuthResponse(auth) {
  return {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    user: toUserResponse(auth.user),
  };
}
