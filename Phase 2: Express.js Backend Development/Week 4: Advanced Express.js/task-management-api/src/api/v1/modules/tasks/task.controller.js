import taskService from "./task.service.js";

export async function getAllTasks(req, res) {
  const tasks = await taskService.findAll();

  return res.success(tasks, "tasks retrieved successfully");
}

export async function getTaskById(req, res) {
  const task = await taskService.findById(Number(req.params.id));

  return res.success(task, "task retrieved successfully");
}

export async function getTaskByUserId(req, res) {
  const tasks = await taskService.findByUserId(Number(req.params.id));
  return res.success(task, "user tasks retrieved successfully");
}

export async function createTask(req, res) {
  const task = await taskService.create(req.body);

  return res.created(task, "task created successfully");
}

export async function updateTask(req, res) {
  const task = await taskService.update(Number(req.params.id), req.body);

  return res.success(task, "task updated successfully");
}

export async function deleteTask(req, res) {
  await taskService.remove(Number(req.params.id));

  res.noCotent();
}
