import students from "./arrayRepo/students.js";

export function create(student) {
  const newId =
    students.length === 0 ? 1 : students[students.length - 1].id + 1;
  students.push({ id: newId, ...student });

  return { id: newId, ...student };
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
