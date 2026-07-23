import AuthSession from "./auth-session.model.js";

function withSession(query, session) {
  return session ? query.session(session) : query;
}

async function createSession(data, session) {
  const authSession = new AuthSession(data);
  await authSession.save({ session });
  return authSession.toObject();
}

async function findByRefreshTokenHash(refreshTokenHash, session) {
  return withSession(
    AuthSession.findOne({ refreshTokenHash })
      .select("+refreshTokenHash")
      .lean(),
    session,
  );
}

async function rotateSession(id, replacedBySessionId, session) {
  const result = await withSession(
    AuthSession.updateOne(
      { _id: id, revokedAt: null },
      {
        $set: {
          revokedAt: new Date(),
          replacedBySessionId,
          lastUsedAt: new Date(),
        },
      },
    ),
    session,
  );
  return result.modifiedCount === 1;
}

async function revokeSession(id, session) {
  return rotateSession(id, null, session);
}

async function revokeAllForUser(userId, session) {
  return withSession(
    AuthSession.updateMany(
      { userId, revokedAt: null },
      { $set: { revokedAt: new Date() } },
    ),
    session,
  );
}

export default {
  createSession,
  findByRefreshTokenHash,
  rotateSession,
  revokeSession,
  revokeAllForUser,
};
