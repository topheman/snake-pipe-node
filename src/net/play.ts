import net from "node:net";

import {
  parseGameState,
  makeWriteLine,
  formatVersionToDisplay,
} from "../common";
import { createServer } from "./net-server";

type PlayProps = {
  mode: "tcp" | "socket";
};

export async function play({ mode }: PlayProps): Promise<{
  /**
   * `net.Server` on which to call `.listen(pathOrPort, () => { run() })`
   */
  server: net.Server;
  /**
   * Call this `run` function once the `server` is listening
   * (You must wait for socket to be opened so that it can be written on)
   */
  run: () => void;
}> {
  const writeLine = makeWriteLine(process.stdout);

  const { options, lines } = await parseGameState();
  const config = {
    ...options,
    featuresWithVersion: {
      ...options.featuresWithVersion,
      [`${mode}-play-node`]: formatVersionToDisplay(), // will see in the future if this is the correct way
    },
  };
  const { server, getActiveSockets } = createServer({ config });

  return {
    server,
    run: async () => {
      writeLine(JSON.stringify(config));

      for await (const line of lines()) {
        const stringifiedLine = JSON.stringify(line);
        writeLine(stringifiedLine);
        for (const socket of getActiveSockets()) {
          socket.write(`${stringifiedLine}\n`);
        }
      }
    },
  };
}
