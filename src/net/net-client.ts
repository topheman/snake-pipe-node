import fs from "node:fs";
import net from "node:net";

type CreateSocketprops = {
  path: string;
};

type CreateTcpProps = {
  port: number;
};

type CreateClientProps = CreateSocketprops | CreateTcpProps;

export function createClient(options: CreateClientProps): {
  client: net.Socket;
} {
  const client = (() => {
    if ("port" in options) {
      return net.createConnection({ port: options.port });
    } else if ("path" in options) {
      const stat = fs.statSync(options.path);
      if (stat.isSocket()) {
        return net.createConnection({ path: options.path });
      }
      throw new Error(`No socket opened at ${options.path}`);
    } else {
      throw new Error(`You must pass either port or path as argument`);
    }
  })();

  return {
    client,
  };
}
