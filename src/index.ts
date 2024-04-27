import { program } from "commander";

import { version, formatVersionToDisplay } from "./common";
import validate from "./validate";

const DEFAULT_UNIX_SOCKET_PATH = "/tmp/snakepipenode.sock";
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
    console.log(options);
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
    console.log(options);
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
