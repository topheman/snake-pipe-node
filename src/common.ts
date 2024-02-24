import readline from "node:readline";
import { stdin } from "node:process";

export async function* parseGameState() {
  const readStdin = readline.createInterface({ input: stdin });
  for await (const line of readStdin) {
    yield line;
  }
}

type StdoutStream = typeof process.stdout;

export function makeWriteLine(stdout: StdoutStream) {
  if (stdout.isTTY) {
    return function writeLineToTTY(str: string) {
      process.stdout.write(`${str}\n`);
      process.stdout.cursorTo(0);
    };
  } else {
    return function writeLine(str: string) {
      console.log(str);
    };
  }
}
