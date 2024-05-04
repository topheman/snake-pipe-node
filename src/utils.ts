import path from "node:path";

import tcpPortUsed from "tcp-port-used";

export function resolvePath(inputPath: string) {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(process.cwd(), inputPath);
}

export function isTcpPortInUse(
  port: number,
  host: string = "127.0.0.1",
): Promise<boolean> {
  return tcpPortUsed.check(port, host).then(
    function (inUse) {
      return inUse;
    },
    function () {
      return true; // in case of error we say the port is in use
    },
  );
}

export function isError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

export function print(str: string) {
  process.stdout.write(str);
}

export function println(str: string) {
  process.stdout.write(`${str}\r\n`);
}

export function eprint(str: string) {
  process.stderr.write(str);
}

export function eprintln(str: string) {
  process.stderr.write(`${str}\r\n`);
}
