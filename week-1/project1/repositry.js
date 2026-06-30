import students from "./students.js";

export function create(student) {
  students.push(student);
  return { ...student };
}
export function getAll() {
  return [...students];
}
export function getStudentById(id) {
  const student = students.find((student) => student.id === id);
  if (!student) {
    return null;
  }
  return { ...student };
}
export function deleteById(id) {
  const index = students.findIndex((student) => student.id === id);
  if (index === -1) {
    throw new Error("Student not found.");
  }
  const deletedStudent = students[index];
  students.splice(index, 1);
  return { ...deletedStudent };
}
export function updateStudent(newData) {
  const student = students.find((student) => student.id == newData.id);
  Object.assign(student, newData);
  return { ...student };
}
