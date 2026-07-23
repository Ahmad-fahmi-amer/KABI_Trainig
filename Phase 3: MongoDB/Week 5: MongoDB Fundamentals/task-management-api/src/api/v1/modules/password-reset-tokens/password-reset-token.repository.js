import PasswordResetToken from "./password-reset-token.model.js";
const withSession = (query, session) =>
  session ? query.session(session) : query;
async function create(data, session) {
  const item = new PasswordResetToken(data);
  await item.save({ session });
  return item.toObject();
}
async function revokeActiveForUser(userId, session) {
  return withSession(
    PasswordResetToken.updateMany(
      { userId, usedAt: null, revokedAt: null, expiresAt: { $gt: new Date() } },
      { $set: { revokedAt: new Date() } },
    ),
    session,
  );
}
async function findValidByHash(tokenHash, session) {
  return withSession(
    PasswordResetToken.findOne({
      tokenHash,
      usedAt: null,
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .select("+tokenHash")
      .lean(),
    session,
  );
}
async function consume(id, session) {
  const result = await withSession(
    PasswordResetToken.updateOne(
      {
        _id: id,
        usedAt: null,
        revokedAt: null,
        expiresAt: { $gt: new Date() },
      },
      { $set: { usedAt: new Date() } },
    ),
    session,
  );
  return result.modifiedCount === 1;
}
export default { create, revokeActiveForUser, findValidByHash, consume };
