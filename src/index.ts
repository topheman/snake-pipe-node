import { program } from "commander";

import { version, formatVersionToDisplay } from "./common";
import validate from "./validate";

program.name(formatVersionToDisplay()).version(version());

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
