import { createInterface } from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { run } from "./run.js";

async function main() {
  const rl = createInterface({ input, output });
  await run(rl);
}

main();
