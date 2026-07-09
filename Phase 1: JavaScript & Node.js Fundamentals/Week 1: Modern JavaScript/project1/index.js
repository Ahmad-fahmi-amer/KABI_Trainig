import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { run } from "./run.js";
import { readFile } from "fs";

async function main() {
  const rl = createInterface({ input, output });
  await run(rl);
}

main();

