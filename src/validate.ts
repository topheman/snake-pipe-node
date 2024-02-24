import { parseGameState } from "./common";

export default async function () {
  const gameState = parseGameState();
  for await (const line of gameState) {
    console.log(line);
  }
}
