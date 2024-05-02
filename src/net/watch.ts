import net from "node:net";

type CreateSocketprops = {
  path: string;
};

type CreateTcpProps = {
  port: number;
};

type PreCheckError = NodeJS.ErrnoException & { exitCode: number };

type CreateClientPreCheckProps<
  T extends CreateSocketprops | CreateTcpProps =
    | CreateSocketprops
    | CreateTcpProps,
> = {
  preCheck: <U = PreCheckError | null>(options: T) => U | Promise<U>;
};

type CreateClientProps = (CreateSocketprops | CreateTcpProps) &
  CreateClientPreCheckProps;

function optionsHasPort(
  options: CreateClientProps,
): options is CreateTcpProps & CreateClientPreCheckProps {
  return "port" in options;
}

function optionsHasPath(
  options: CreateClientProps,
): options is CreateSocketprops & CreateClientPreCheckProps {
  return "path" in options;
}

export async function createClient(options: CreateClientProps): Promise<{
  client: net.Socket;
}> {
  const client = await (async () => {
    const preCheckResult = await options.preCheck(options); // need to call await because it can be a promise
    if (preCheckResult) {
      console.error(preCheckResult.message);
      process.exit(preCheckResult.exitCode ?? 1);
    }
    if (optionsHasPort(options)) {
      return net.createConnection({ port: options.port });
    } else if (optionsHasPath(options)) {
      // const stat = fs.statSync(options.path);
      // if (stat.isSocket()) {
      return net.createConnection({ path: options.path });
      // }
      // throw new Error(`No socket opened at ${options.path}`);
    } else {
      throw new Error(`You must pass either port or path as argument`);
    }
  })();

  process.on("exit", () => {
    client.destroy();
  });
  client.pipe(process.stdout);

  return {
    client,
  };
}
