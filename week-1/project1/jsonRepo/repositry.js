import { readFile, writeFile } from "fs/promises";
const FILE_PATH = "./jsonRepo/students.json";

async function readStudents() {
  const data = await readFile(FILE_PATH, "utf8");

  return JSON.parse(data);
}
async function writeStudents(students) {
  await writeFile(FILE_PATH, JSON.stringify(students, null, 2));
}

export async function create(student) {
  const students = await readStudents();
  const id = students.length === 0 ? 1 : students[students.length - 1].id + 1;
  const newStudent = { id, ...student };
  students.push(newStudent);
  await writeStudents(students);
  return { ...newStudent };
}
export async function getAll() {
  const students = await readStudents();
  return students.map((student) => ({ ...student }));
}
export async function getStudentById(id) {
  const students = await readStudents();
  const student = students.find((student) => student.id === id);
  if (!student) {
    return null;
  }
  return { ...student };
}
export async function deleteById(id) {
  const students = await readStudents();
  const index = students.findIndex((student) => student.id === id);
  if (index === -1) {
    throw new Error("Student not found.");
  }
  const deletedStudent = students[index];
  students.splice(index, 1);
  await writeStudents(students);
  return { ...deletedStudent };
}
export async function updateStudent(newData) {
  const students = await readStudents();
  const student = await students.find((student) => student.id === newData.id);
  if (!student) {
    throw new Error("student not found");
  }
  Object.assign(student, newData);
  await writeStudents(students);
  return { ...student };
}
