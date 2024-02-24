import readline from "node:readline";
import { stdin } from "node:process";

export async function* parseGameState() {
  const readStdin = readline.createInterface({ input: stdin });
  for await (const line of readStdin) {
    yield line;
  }
}
