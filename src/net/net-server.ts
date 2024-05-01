import net from "node:net";

import { parseGameState } from "../common";

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
    console.error("[DEBUG] connection from client"); // write debug to stderr
    // keep track of the socket
    sockets.add(socket);
    // emit the config through the socket (first line that was passed through stdin)
    socket.write(`${JSON.stringify(config)}\n`);

    socket.on("end", () => {
      console.error("[DEBUG] disconnection from client"); // write debug to stderr
      socket.destroy();
      sockets.delete(socket);
    });
  });

  return {
    server,
    getActiveSockets: () => sockets.values(),
  };
}
