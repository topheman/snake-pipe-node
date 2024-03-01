import readline from "node:readline";
import { stdin } from "node:process";

import packageJson from "../package.json";
import { initOptionsSchema, gameSchema } from "./schemas";

export function version() {
  return packageJson.version;
}

export function formatVersionToDisplay() {
  return `snakepipe@${packageJson.version}(node)`;
}

export function makeLineIterator(stdinIterator: AsyncIterableIterator<string>) {
  return async function* () {
    for await (const line of stdinIterator) {
      yield gameSchema.parse(JSON.parse(line));
    }
  };
}

export async function parseGameStateFromAsyncIterator(
  stream: AsyncIterableIterator<string>,
) {
  const options = initOptionsSchema.parse(
    JSON.parse((await stream.next()).value),
  );
  return {
    options,
    lines: makeLineIterator(stream),
  };
}

export async function parseGameState() {
  const readStdin = readline.createInterface({ input: stdin });
  const stdinIterator = readStdin[Symbol.asyncIterator]();
  return parseGameStateFromAsyncIterator(stdinIterator);
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
