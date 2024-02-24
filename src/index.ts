import { program } from "commander";
import packageJson from "../package.json";

import validate from "./validate";

program.name("snakepipe-node").version(packageJson.version);

program
  .command("validate")
  .description(
    "Accepts stream from stdin, validates it and writes it to stdout",
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .action((options) => {
    validate();
  });

program.parse();
