import {
  create,
  deleteById,
  getAll,
  getStudentById,
  updateStudent,
} from "./repositry.js";
import { validateStudent, validateUpdateData } from "./validator.js";

export async function createStudent(user) {
  const { name, age, major } = user;
  validateStudent(user);
  const students = await getAll();
  const newId =
    students.length === 0 ? 1 : students[students.length - 1].id + 1;

  const student = { id: newId, ...user };
  create(student);

  return { message: "student was created", student };
}

export async function getAllStudents() {
  const students = await getAll();
  return students;
}

export async function getById(id) {
  const student = await getStudentById(parseInt(id));
  if (!student) {
    throw new Error("user not found");
  }
  return student;
}

export async function remove(id) {
  const student = await deleteById(parseInt(id));

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
