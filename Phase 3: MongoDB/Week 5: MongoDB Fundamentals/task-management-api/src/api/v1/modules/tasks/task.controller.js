import taskService from "./task.service.js";
const mapChild = (item) => ({ ...item, id: String(item._id), _id: undefined });
const mapTask = (task) => ({
  id: String(task._id),
  title: task.title,
  description: task.description,
  status: task.status,
  priority: task.priority,
  dueDate: task.dueDate,
  assigneeId: String(task.assigneeId),
  teamId: String(task.teamId),
  comments: task.comments.map(mapChild),
  attachments: task.attachments.map(mapChild),
  createdBy: String(task.createdBy),
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
});
export async function listTasks(req, res) {
  const result = await taskService.listTasks(req.validated.query, req.user);
  return res.success({ ...result, items: result.items.map(mapTask) });
}
export async function getTask(req, res) {
  return res.success(
    mapTask(await taskService.getTask(req.validated.params.id, req.user)),
  );
}
export async function createTask(req, res) {
  return res.created(
    mapTask(await taskService.createTask(req.validated.body, req.user)),
  );
}
export async function updateTask(req, res) {
  return res.success(
    mapTask(
      await taskService.updateTask(
        req.validated.params.id,
        req.validated.body,
        req.user,
      ),
    ),
  );
}
export async function updateStatus(req, res) {
  return res.success(
    mapTask(
      await taskService.updateStatus(
        req.validated.params.id,
        req.validated.body.status,
        req.user,
      ),
    ),
  );
}
export async function addComment(req, res) {
  return res.created(
    mapTask(
      await taskService.addComment(
        req.validated.params.id,
        req.validated.body,
        req.user,
      ),
    ),
  );
}
export async function updateComment(req, res) {
  return res.success(
    mapTask(
      await taskService.updateComment(
        req.validated.params.id,
        req.validated.params.childId,
        req.validated.body,
        req.user,
      ),
    ),
  );
}
export async function removeComment(req, res) {
  await taskService.removeComment(
    req.validated.params.id,
    req.validated.params.childId,
    req.user,
  );
  return res.noContent();
}
export async function addAttachment(req, res) {
  return res.created(
    mapTask(
      await taskService.addAttachment(
        req.validated.params.id,
        req.validated.body,
        req.user,
      ),
    ),
  );
}
export async function removeAttachment(req, res) {
  await taskService.removeAttachment(
    req.validated.params.id,
    req.validated.params.childId,
    req.user,
  );
  return res.noContent();
}
