import { program } from "commander";

import { version, formatVersionToDisplay } from "./common";
import { resolvePath } from "./utils";
import validate from "./validate";
import fs from "node:fs";
import { play } from "./net/play";

const DEFAULT_UNIX_SOCKET_PATH = "/tmp/snakepipe-node.sock";
const DEFAULT_TCP_PORT = 8050;

type SocketCommand = {
  path: string;
};

type TcpCommand = {
  port: string;
};

program.name(formatVersionToDisplay()).version(version());

program
  .command("validate")
  .description(
    "Accepts stream from stdin, validates it and writes it to stdout",
  )
  .action(() => {
    validate();
  });

program
  .command("socket-play")
  .description("Accepts gamestate from stdin and pushes it to a unix socket")
  .option(
    "--path",
    `Unix socket file path (default: ${DEFAULT_UNIX_SOCKET_PATH})`,
    DEFAULT_UNIX_SOCKET_PATH,
  )
  .action((options: SocketCommand) => {
    console.error(`[DEBUG][options] ${JSON.stringify(options)}`); // write debug to stderr
    try {
      fs.unlinkSync(resolvePath(options.path));
    } catch (e) {
      // do nothing
    }
    play({ mode: "socket" }).then(({ server, run }) => {
      server.listen(options.path, () => {
        run();
      });
    });
  });

program
  .command("socket-watch")
  .description("Reads gamestate from a unix socket")
  .option(
    "--path",
    `Unix socket file path (default: ${DEFAULT_UNIX_SOCKET_PATH})`,
    DEFAULT_UNIX_SOCKET_PATH,
  )
  .action((options: SocketCommand) => {
    console.error(`[DEBUG][options] ${JSON.stringify(options)}`);
  });

program
  .command("tcp-play")
  .description("Accepts gamestate from stdin and pushes it to a tcp socket")
  .option(
    "--path",
    `Port number (default: ${DEFAULT_TCP_PORT})`,
    DEFAULT_TCP_PORT.toString(),
  )
  .action((options: TcpCommand) => {
    console.log(options);
  });

program
  .command("tcp-watch")
  .description("Reads gamestate from a tcp socket")
  .option(
    "--path",
    `Port number (default: ${DEFAULT_TCP_PORT})`,
    DEFAULT_TCP_PORT.toString(),
  )
  .action((options: TcpCommand) => {
    console.log(options);
  });

program.parse();
