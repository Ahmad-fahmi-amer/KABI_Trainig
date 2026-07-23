function iso(value) {
  return value ? new Date(value).toISOString() : null;
}

export function toUserResponse(user) {
  return {
    id: String(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    jobTitle: user.jobTitle,
    bio: user.bio,
    skills: user.skills,
    role: user.role,
    teamId: user.teamId ? String(user.teamId) : null,
    status: user.status,
    lastLoginAt: iso(user.lastLoginAt),
    createdAt: iso(user.createdAt),
    updatedAt: iso(user.updatedAt),
  };
}

export function toUsersResponse(result) {
  return { ...result, items: result.items.map(toUserResponse) };
}

export function toAuthResponse(authResult) {
  return {
    accessToken: authResult.accessToken,
    refreshToken: authResult.refreshToken,
    user: toUserResponse(authResult.user),
  };
}
