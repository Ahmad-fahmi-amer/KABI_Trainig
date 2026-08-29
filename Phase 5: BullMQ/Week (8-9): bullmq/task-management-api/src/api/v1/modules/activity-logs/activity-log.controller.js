import activityRepository from "./activity-log.repository.js";
export async function list(req, res) {
  const result = await activityRepository.findActivityLogs(req.validated.query);
  return res.success({
    ...result,
    items: result.items.map((item) => ({
      ...item,
      id: String(item._id),
      _id: undefined,
    })),
  });
}
