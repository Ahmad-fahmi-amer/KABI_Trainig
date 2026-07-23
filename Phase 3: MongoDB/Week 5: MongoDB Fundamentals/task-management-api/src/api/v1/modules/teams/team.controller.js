import teamService from "./team.service.js";
const mapTeam = (team) => ({
  id: String(team._id),
  name: team.name,
  managerId: String(team.managerId),
  createdBy: String(team.createdBy),
  createdAt: team.createdAt,
  updatedAt: team.updatedAt,
});
export async function listTeams(req, res) {
  const result = await teamService.getTeams(req.validated.query);
  return res.success({ ...result, items: result.items.map(mapTeam) });
}
export async function getTeam(req, res) {
  return res.success(
    mapTeam(await teamService.getTeamById(req.validated.params.id)),
  );
}
export async function createTeam(req, res) {
  return res.created(
    mapTeam(await teamService.createTeam(req.validated.body, req.user)),
  );
}
export async function updateTeam(req, res) {
  return res.success(
    mapTeam(
      await teamService.updateTeam(
        req.validated.params.id,
        req.validated.body,
        req.user,
      ),
    ),
  );
}
