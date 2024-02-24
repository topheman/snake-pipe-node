import { parseGameState, makeWriteLine } from "./common";

export default async function () {
  const writeLine = makeWriteLine(process.stdout);
  const gameState = parseGameState();
  for await (const line of gameState) {
    writeLine(line);
  }
}
