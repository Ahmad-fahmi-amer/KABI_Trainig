import * as service from "../services/studentService.js";
import { success, created, noContent, error } from "../utils/response.js";

export async function getStudents(req, res) {
  const students = await service.getAll();

  success(res, students);
}

export async function getStudent(req, res) {
  const student = await service.getById(req.params.id);

  if (!student) return error(res, 404, "Student not found");

  success(res, student);
}

export async function createStudent(req, res) {
  const result = await service.create(req.body);

  if (result.error) return error(res, 400, result.error);

  created(res, result);
}

export async function updateStudent(req, res) {
  const result = await service.update(req.params.id, req.body);

  if (result.error) return error(res, 400, result.error);

  if (!result) return error(res, 404, "Student not found");

  success(res, result);
}

export async function deleteStudent(req, res) {
  const deleted = await service.remove(req.params.id);

  if (!deleted) return error(res, 404, "Student not found");

  noContent(res);
}
