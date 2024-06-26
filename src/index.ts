import { program } from "commander";

import { version, formatVersionToDisplay, exitcode } from "./common";
import { resolvePath, isTcpPortInUse, eprintln } from "./utils";
import validate from "./validate";
import fs from "node:fs";
import { play } from "./net/play";
import { createClient } from "./net/watch";
import { isError } from "./utils";

const DEFAULT_UNIX_SOCKET_PATH = "/tmp/snakepipe.sock";
const DEFAULT_TCP_PORT = 8050;
const DEFAULT_TCP_HOST = "127.0.0.1";

type SocketCommand = {
  path: string;
};

type TcpCommand = {
  port: string;
  host: string;
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
  .option("--path <path>", "Unix socket file path", DEFAULT_UNIX_SOCKET_PATH)
  .action((options: SocketCommand) => {
    try {
      fs.unlinkSync(resolvePath(options.path));
    } catch (e) {
      // do nothing
    }
    play({ mode: "socket" }).then(({ server, run }) => {
      server.listen(resolvePath(options.path), () => {
        run();
      });
    });
  });

program
  .command("socket-watch")
  .description("Reads gamestate from a unix socket")
  .option("--path <path>", "Unix socket file path", DEFAULT_UNIX_SOCKET_PATH)
  .action((options: SocketCommand) => {
    let stat: ReturnType<typeof fs.statSync>;
    try {
      stat = fs.statSync(options.path);
    } catch (e) {
      eprintln(`[ERROR] No existing file at ${options.path}`);
      process.exit(exitcode.OSFILE);
    }
    if (!stat!.isSocket()) {
      eprintln(`[ERROR] No existing socket file at ${options.path}`);
      process.exit(exitcode.OSFILE);
    }
    try {
      const { client, bindClient } = createClient({ path: options.path });
      bindClient(client);
      client.on("error", (e) => {
        if (isError(e) && e.code === "ECONNREFUSED") {
          eprintln(
            `[ERROR] Could not connect to socket at ${options.path}, make sure you first launch socket-play`,
          );
          process.exit(exitcode.IOERR);
        }
      });
    } catch (e) {
      if (isError(e)) {
        eprintln(
          `[ERROR] Could not open socket at ${options.path} - ${e.code} - ${e.message}`,
        );
        process.exit(1);
      }
    }
  });

program
  .command("tcp-play")
  .description("Accepts gamestate from stdin and pushes it to a tcp socket")
  .option("--port <port>", "Port number", DEFAULT_TCP_PORT.toString())
  .option(
    "--host <host>",
    `Tcp host (default: ${DEFAULT_TCP_HOST})`,
    DEFAULT_TCP_HOST,
  )
  .action(async (options: TcpCommand) => {
    const port = Number(options.port);
    const host = options.host;
    const portIsInUse = await isTcpPortInUse(port, host);
    if (portIsInUse) {
      process.stderr.write(`[ERROR] ${host}:${port} is already taken.\r\n`);
      process.exit(exitcode.UNAVAILABLE);
    }
    play({ mode: "tcp" }).then(({ server, run }) => {
      server.listen({ port, host }, () => {
        run();
      });
    });
  });

program
  .command("tcp-watch")
  .description("Reads gamestate from a tcp socket")
  .option("--port <path>", "Port number", DEFAULT_TCP_PORT.toString())
  .option("--host <host>", "Tcp host", DEFAULT_TCP_HOST)
  .action((options: TcpCommand) => {
    const port = Number(options.port);
    const host = options.host;
    try {
      const { client, bindClient } = createClient({ port, host });
      bindClient(client);
      client.on("error", (e) => {
        if (isError(e) && e.code === "ECONNREFUSED") {
          process.stderr.write(
            `[ERROR] Could not connect to ${host}:${port}, make sure you first launch tcp-play\r\n`,
          );
          process.exit(exitcode.IOERR);
        }
      });
    } catch (e) {
      if (isError(e)) {
        process.stderr.write(
          `[ERROR] Could not open connection to ${host}:${port} - ${e.code} - ${e.message}\r\n`,
        );
        process.exit(1);
      }
    }
  });

program.parse();
