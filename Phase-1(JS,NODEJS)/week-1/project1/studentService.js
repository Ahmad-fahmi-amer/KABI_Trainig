import {
  create,
  deleteById,
  getAll,
  getStudentById,
  updateStudent,
} from "./jsonRepo/repositry.js";
import { validateStudent, validateUpdateData } from "./validator.js";

export async function createStudent(user) {
  validateStudent(user);

  const student = await create(user);

  return { message: "student was created", student };
}

export async function getAllStudents() {
  return await getAll();
}

export async function getById(id) {
  const student = await getStudentById(parseInt(id));
  if (!student) {
    throw new Error("user not found");
  }
  return student;
}

export async function remove(id) {
  const student = await deleteById(id);

  return { message: "user was deleted", student };
}
export async function update(user) {
  const student = await getById(id);
  if (!student) {
    throw new Error("student not found");
  }

  const data = validateUpdateData(user, student);

  const updated = await updateStudent(data);

  console.log(updated);

  return { message: "user was updated", updated };
}
