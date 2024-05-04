import net from "node:net";

import { parseGameState } from "../common";
import { eprintln } from "../utils";

type ParseGameStateResult = Awaited<ReturnType<typeof parseGameState>>;

type CreateServerProps = {
  config: ParseGameStateResult["options"];
};

export function createServer({ config }: CreateServerProps): {
  server: net.Server;
  getActiveSockets: () => IterableIterator<net.Socket>;
} {
  const server = net.createServer();
  const sockets = new Set<net.Socket>();

  server.on("connection", (socket) => {
    eprintln("[DEBUG] connection from client");
    // keep track of the socket
    sockets.add(socket);
    // emit the config through the socket (first line that was passed through stdin)
    socket.write(`${JSON.stringify(config)}\n`);

    socket.on("end", () => {
      eprintln("[DEBUG] disconnection from client");
      socket.destroy();
      sockets.delete(socket);
    });
  });

  return {
    server,
    getActiveSockets: () => sockets.values(),
  };
}
