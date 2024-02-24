import {
  parseGameState,
  makeWriteLine,
  formatVersionToDisplay,
} from "./common";

export default async function () {
  const writeLine = makeWriteLine(process.stdout);
  const { options, lines } = await parseGameState();
  writeLine(
    JSON.stringify({
      ...options,
      featuresWithVersion: {
        ...options.featuresWithVersion,
        validate: formatVersionToDisplay(),
      },
    }),
  );
  for await (const line of lines()) {
    writeLine(JSON.stringify(line));
  }
}
