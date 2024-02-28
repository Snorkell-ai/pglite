export const IN_NODE =
  typeof process === "object" &&
  typeof process.versions === "object" &&
  typeof process.versions.node === "string";

/**
 * Retrieves the node values.
 * @throws {Error} Throws an error if the values cannot be retrieved.
 * @returns {Promise<{ dirname: string | undefined, require: ((id: string) => any) | undefined }>} A promise that resolves to an object containing the dirname and require values.
 */
export async function nodeValues() {
  let dirname: string | undefined = undefined;
  let require: ((id: string) => any) | undefined = undefined;
  if (IN_NODE) {
    dirname = (await import("path")).dirname(import.meta.url);
    require = (await import("module")).default.createRequire(import.meta.url);
  }
  return { dirname, require };
}
