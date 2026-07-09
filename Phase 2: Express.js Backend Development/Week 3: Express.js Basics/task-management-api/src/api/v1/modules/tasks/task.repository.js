import { tasks } from "../../../../../data/tasks.data.js";
function findAll() {
  return tasks;
}
function findById(id) {
  const task = tasks.find((task) => task.id === id) || null;
  return task;
}

function findByUserId(userId) {
  const task = tasks.filter((task) => task.userId === userId);
  return task;
}

function create(task) {
  tasks.push(task);
  return task;
}

function update(id, updates) {
  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return null;
  }

  Object.assign(task, updates);

  return task;
}
function remove(id) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index === -1) {
    return null;
  }

  return tasks.splice(index, 1)[0];
}
const taskRepository = {
  findAll,
  findById,
  findByUserId,
  update,
  create,
  remove,
};
export default taskRepository;
