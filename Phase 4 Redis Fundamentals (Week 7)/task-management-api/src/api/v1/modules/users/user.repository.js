import User from "./user.model.js";

function withSession(query, session) {
  return session ? query.session(session) : query;
}

async function createUser(data, session) {
  const user = new User(data);
  await user.save({ session });
  return user.toObject();
}

async function findUserById(id, session) {
  return withSession(User.findById(id).lean(), session);
}

async function findAuthUserByEmail(email, session) {
  return withSession(
    User.findOne({ email }).select("+passwordHash").lean(),
    session,
  );
}

async function existsUserByEmail(email, session) {
  return Boolean(await withSession(User.exists({ email }), session));
}

async function countUsers(session) {
  return withSession(User.countDocuments(), session);
}

async function findUsers(query) {
  const { search, role, teamId, status, page, limit, sortBy, sortOrder } =
    query;
  const filter = {};

  if (search) filter.$text = { $search: search };
  if (role) filter.role = role;
  if (teamId) filter.teamId = teamId;
  if (status) filter.status = status;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "ASC" ? 1 : -1 };

  const [items, total] = await Promise.all([
    User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function updateUserProfile(id, data, session) {
  return withSession(
    User.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function updateUserRole(id, role, session) {
  return updateUserProfile(id, { role }, session);
}

async function updateUserTeam(id, teamId, session) {
  return updateUserProfile(id, { teamId }, session);
}

async function updateUserStatus(id, status, session) {
  return updateUserProfile(id, { status }, session);
}

async function updatePasswordHash(id, passwordHash, session) {
  const result = await withSession(
    User.updateOne({ _id: id }, { $set: { passwordHash } }),
    session,
  );
  return result.matchedCount === 1;
}

async function updateLastLogin(id, lastLoginAt, session) {
  const result = await withSession(
    User.updateOne({ _id: id }, { $set: { lastLoginAt } }),
    session,
  );
  return result.matchedCount === 1;
}

export default {
  createUser,
  findUserById,
  findAuthUserByEmail,
  existsUserByEmail,
  countUsers,
  findUsers,
  updateUserProfile,
  updateUserRole,
  updateUserTeam,
  updateUserStatus,
  updatePasswordHash,
  updateLastLogin,
};
