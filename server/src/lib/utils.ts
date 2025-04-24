import { customAlphabet } from "nanoid";

/**
 * Generates a unique ID with the provided prefix.
 * @param pfx - The prefix to use for the generated ID.
 * @returns A unique ID in the format `{pfx}_{randomId}`.
 */

export function genId(pfx: string) {
  const nanoid = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 10);
  return [pfx, nanoid()].join("_");
}
