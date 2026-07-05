import taskRepository from "./task.repository.js";

async function findAll() {
  return await taskRepository.findAll();
}

async function findById(id) {
  const task = await taskRepository.findById(id);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }

  return task;
}

async function findByUserId(userId) {
  return taskRepository.findByUserId(userId);
}

async function create(taskData) {
  const tasks = taskRepository.findAll();
  const nextId =
    tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

  const task = {
    id: nextId,
    ...taskData,
  };

  return taskRepository.create(task);
}

async function update(id, updates) {
  const existingTask = taskRepository.findById(id);

  if (!existingTask) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }

  return taskRepository.update(id, updates);
}

async function remove(id) {
  const existingTask = taskRepository.findById(id);

  if (!existingTask) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    error.expose = true;
    throw error;
  }

  return taskRepository.remove(id);
}

const taskService = {
  findAll,
  findById,
  findByUserId,
  create,
  update,
  remove,
};

export default taskService;
