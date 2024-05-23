import readline from "node:readline";
import { stdin } from "node:process";

import packageJson from "../package.json";
import { initOptionsSchema, gameSchema } from "./schemas";
import { println } from "./utils";

export function version() {
  return packageJson.version;
}

export function formatVersionToDisplay() {
  return `snakepipe@${packageJson.version}(node)`;
}

export function makeLineIterator(stdinIterator: AsyncIterableIterator<string>) {
  return async function* () {
    for await (const line of stdinIterator) {
      try {
        const result = gameSchema.parse(JSON.parse(line));
        yield result;
      } catch (e) {
        // eprintln(`[DEBUG] Ignored invalid frame: ${line}`);
      }
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

export type ParseGameStateProps = {
  /**
   * Will be called when the stream from `stdin` is closed.
   * By default stops the current process with `process.exit(0)`
   */
  onStdinEnd?: () => void;
};

export async function parseGameState({
  onStdinEnd = () => {
    process.exit(0);
  },
}: ParseGameStateProps = {}) {
  // once stdin in closed, exit the current process otherwise, it won't accept interupt signals
  process.stdin.on("end", () => {
    onStdinEnd();
  });
  const readStdin = readline.createInterface({ input: stdin });
  const stdinIterator = readStdin[Symbol.asyncIterator]();
  return parseGameStateFromAsyncIterator(stdinIterator);
}

type StdoutStream = typeof process.stdout;

export function makeWriteLine(stdout: StdoutStream) {
  if (stdout.isTTY) {
    return function writeLineToTTY(str: string) {
      println(str);
    };
  } else {
    return function writeLine(str: string) {
      println(str);
    };
  }
}

export const exitcode = {
  DATAERR: 65,
  UNAVAILABLE: 69,
  OSFILE: 72,
  IOERR: 74,
} as const;
