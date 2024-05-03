import net from "node:net";

type CreateSocketprops = {
  path: string;
};

type CreateTcpProps = {
  port: number;
  host: string;
};

type CreateClientProps = CreateSocketprops | CreateTcpProps;

function optionsIsTcp(options: CreateClientProps): options is CreateTcpProps {
  return "port" in options && "host" in options;
}

function optionsIsSocket(
  options: CreateClientProps,
): options is CreateSocketprops {
  return "path" in options;
}

function bindClient(client: net.Socket) {
  process.on("exit", () => {
    client.destroy();
  });
  client.pipe(process.stdout);
}

export function createClient(options: CreateClientProps): {
  client: net.Socket;
  /**
   * - Pipes client to `stdout`
   * - Binds `client.destroy()` to process.on('exit')
   */
  bindClient: typeof bindClient;
} {
  const client = (() => {
    if (optionsIsTcp(options)) {
      return net.createConnection({ port: options.port, host: options.host });
    } else if (optionsIsSocket(options)) {
      return net.createConnection({ path: options.path });
    } else {
      throw new Error(`You must pass either host/port or path as argument`);
    }
  })();

  return {
    client,
    bindClient,
  };
}
