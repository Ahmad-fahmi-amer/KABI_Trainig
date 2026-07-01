import { createStudent } from "./studentService.js";
import { controller } from "./controller.js";
export async function run(rl) {
  while (true) {
    try {
      console.log(
        "available methods [create,getAll,getById,delete,update,exit]",
      );
      const methods = ["create", "getall", "getbyid", "delete", "update"];

      let input = await rl.question("select one: ");
      input = input.trim().toLowerCase();

      if (input == "exit") {
        rl.close();
        break;
      } else if (!methods.includes(input)) {
        console.log("\x1b[31m%s\x1b[0m", "you must write one of these methods");
      } else await controller(input, rl);
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", error.message);
    }
  }
}
