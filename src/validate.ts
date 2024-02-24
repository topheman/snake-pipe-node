import { parseGameState, makeWriteLine } from "./common";

export default async function () {
  const writeLine = makeWriteLine(process.stdout);
  const { options, lines } = await parseGameState();
  writeLine(JSON.stringify(options));
  for await (const line of lines()) {
    writeLine(JSON.stringify(line));
  }
}
