import path from "node:path";

import tcpPortUsed from "tcp-port-used";

export function resolvePath(inputPath: string) {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(process.cwd(), inputPath);
}

export function isTcpPortInUse(port: number): Promise<boolean> {
  return tcpPortUsed.check(port, "127.0.0.1").then(
    function (inUse) {
      return inUse;
    },
    function () {
      return true; // in case of error we say the port is in use
    },
  );
}
