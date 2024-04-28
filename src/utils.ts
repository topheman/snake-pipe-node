import path from "node:path";

export function resolvePath(inputPath: string) {
  if (path.isAbsolute(inputPath)) {
    return inputPath;
  }
  return path.resolve(process.cwd(), inputPath);
}
