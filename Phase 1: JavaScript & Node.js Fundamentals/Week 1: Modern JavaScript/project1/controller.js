import {
  createStudent,
  getAllStudents,
  getById,
  remove,
  update,
} from "./studentService.js";
import { getCreateData, getId, getUpdateData } from "./getData.js";
export async function controller(method, rl) {
  switch (method) {
    case "create":
      const newUser = await createStudent(await getCreateData(rl));
      console.log(newUser);
      break;

    case "getall":
      const students = await getAllStudents();
      console.log(students);
      break;

    case "getbyid":
      const student = await getById(await getId(rl));
      console.log(student);
      break;

    case "delete":
      const deleted = await remove(await getId(rl));
      console.log(deleted);
      break;

    case "update":
      const updated = await update(await getUpdateData(rl));
      console.log(updated);
      break;
  }
}
