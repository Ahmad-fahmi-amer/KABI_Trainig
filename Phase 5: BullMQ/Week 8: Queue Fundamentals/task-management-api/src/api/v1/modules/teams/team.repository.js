import Team from "./team.model.js";

const withSession = (query, session) =>
  session ? query.session(session) : query;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function createTeam(data, session) {
  const team = new Team(data);
  await team.save({ session });
  return team.toObject();
}

async function findTeamById(id, session) {
  return withSession(Team.findById(id).lean(), session);
}

async function existsTeamById(id, session) {
  return Boolean(await withSession(Team.exists({ _id: id }), session));
}

async function findTeamByManagerId(managerId, session) {
  return withSession(Team.findOne({ managerId }).lean(), session);
}

async function findTeams({ search, page, limit, sortBy, sortOrder }) {
  const filter = search
    ? { name: { $regex: escapeRegex(search.trim()), $options: "i" } }
    : {};
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === "ASC" ? 1 : -1 };
  const [items, total] = await Promise.all([
    Team.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Team.countDocuments(filter),
  ]);
  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function renameTeam(id, name, session) {
  return withSession(
    Team.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

async function changeTeamManager(id, managerId, session) {
  return withSession(
    Team.findByIdAndUpdate(
      id,
      { $set: { managerId } },
      { new: true, runValidators: true },
    ).lean(),
    session,
  );
}

export default {
  createTeam,
  findTeamById,
  existsTeamById,
  findTeamByManagerId,
  findTeams,
  renameTeam,
  changeTeamManager,
};
