import { program } from "commander";

import { version, formatVersionToDisplay } from "./common";
import { resolvePath, isTcpPortInUse } from "./utils";
import validate from "./validate";
import fs from "node:fs";
import { play } from "./net/play";
import { createClient } from "./net/watch";
import { isError } from "./utils";

const DEFAULT_UNIX_SOCKET_PATH = "/tmp/snakepipe-node.sock";
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
    const stat = fs.statSync(options.path);
    if (!stat.isSocket()) {
      console.error(`[ERROR] No existing socket file at ${options.path}`);
      process.exit(1);
    }
    try {
      const { client, bindClient } = createClient({ path: options.path });
      bindClient(client);
      client.on("error", (e) => {
        if (isError(e) && e.code === "ECONNREFUSED") {
          console.error(
            `[ERROR] Could not connect to socket at ${options.path}, make sure you first launch socket-play`,
          );
          process.exit(1);
        }
      });
    } catch (e) {
      if (isError(e)) {
        console.error(
          `[ERROR] Could not open socket at ${options.path} - ${e.code} - ${e.message}`,
        );
      }
    }
  });

program
  .command("tcp-play")
  .description("Accepts gamestate from stdin and pushes it to a tcp socket")
  .option(
    "--port",
    `Port number (default: ${DEFAULT_TCP_PORT})`,
    DEFAULT_TCP_PORT.toString(),
  )
  .option("--host", `Tcp host (default: ${DEFAULT_TCP_HOST})`, DEFAULT_TCP_HOST)
  .action(async (options: TcpCommand) => {
    const port = Number(options.port);
    const host = options.host;
    console.error(`[DEBUG][options] ${JSON.stringify(options)}`);
    const portIsInUse = await isTcpPortInUse(port, host);
    if (portIsInUse) {
      console.error(`[ERROR] ${host}:${port} is already taken.`);
      process.exit(1);
    }
    play({ mode: "tcp" }).then(({ server, run }) => {
      server.listen({ port, host }, () => {
        console.error(`[DEBUG] Listening on ${host}:${port}`);
        run();
      });
    });
  });

program
  .command("tcp-watch")
  .description("Reads gamestate from a tcp socket")
  .option(
    "--port",
    `Port number (default: ${DEFAULT_TCP_PORT})`,
    DEFAULT_TCP_PORT.toString(),
  )
  .option("--host", `Tcp host (default: ${DEFAULT_TCP_HOST})`, DEFAULT_TCP_HOST)
  .action((options: TcpCommand) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const port = Number(options.port);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const host = options.host;
    console.log(options);
  });

program.parse();
