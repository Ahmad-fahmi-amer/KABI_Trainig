import taskService from "./task.service.js";

export function getAllTasks(req, res, next) {
  try {
    const tasks = taskService.findAll();

    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export function getTaskById(req, res, next) {
  try {
    const task = taskService.findById(Number(req.params.id));

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export function getTaskByUserId(req, res, next) {
  try {
    const tasks = taskService.findByUserId(Number(req.params.id));

    res.json(tasks);
  } catch (error) {
    next(error);
  }
}

export function createTask(req, res, next) {
  try {
    const task = taskService.create(req.body);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
}

export function updateTask(req, res, next) {
  try {
    const task = taskService.update(Number(req.params.id), req.body);

    res.json(task);
  } catch (error) {
    next(error);
  }
}

export function deleteTask(req, res, next) {
  try {
    taskService.remove(Number(req.params.id));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
