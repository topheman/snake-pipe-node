import readline from "node:readline";
import { stdin } from "node:process";

import { initOptionsSchema, gameSchema } from "./schemas";

function makeLineIterator(stdinIterator: AsyncIterableIterator<string>) {
  return async function* () {
    for await (const line of stdinIterator) {
      yield gameSchema.parse(JSON.parse(line));
    }
  };
}

export async function parseGameState() {
  const readStdin = readline.createInterface({ input: stdin });
  const stdinIterator = readStdin[Symbol.asyncIterator]();
  const options = initOptionsSchema.parse(
    JSON.parse((await stdinIterator.next()).value),
  );
  return {
    options,
    lines: makeLineIterator(stdinIterator),
  };
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
