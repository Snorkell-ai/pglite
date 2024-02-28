import * as fs from "fs/promises";
import * as path from "path";

/**
 * Asynchronously finds and replaces a string or regular expression in a file.
 * @param find The string or regular expression to find in the file.
 * @param replace The string to replace the found content with.
 * @param file The path to the file where the find and replace operation will be performed.
 * @throws {Error} Throws an error if there is an issue reading or writing the file.
 */
async function findAndReplaceInFile(
  find: string | RegExp,
  replace: string,
  file: string
): Promise<void> {
  const content = await fs.readFile(file, "utf8");
  const replacedContent = content.replace(find, replace);
  await fs.writeFile(file, replacedContent);
}

/**
 * Asynchronously finds and replaces content in files within a specified directory.
 * 
 * @param dir The directory in which to search for files.
 * @param find The string or regular expression to search for within the files.
 * @param replace The string to replace the found content with.
 * @param extensions An array of file extensions to filter the search by.
 * @param recursive Whether to search for files recursively within subdirectories.
 * 
 * @throws {Error} If there is an error reading the directory or file.
 */
async function findAndReplaceInDir(
  dir: string,
  find: string | RegExp,
  replace: string,
  extensions: string[],
  recursive = false
): Promise<void> {
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory() && recursive) {
      await findAndReplaceInDir(filePath, find, replace, extensions);
    } else {
      const fileExt = path.extname(file.name);
      if (extensions.includes(fileExt)) {
        await findAndReplaceInFile(find, replace, filePath);
      }
    }
  }
}

/**
 * Asynchronous function to perform main tasks.
 * 
 * @throws {Error} Throws an error if any of the asynchronous operations fail.
 */
async function main() {
  await fs.copyFile("./release/postgres.wasm", "./dist/postgres.wasm");
  await fs.copyFile("./release/share.data", "./dist/share.data");
  await findAndReplaceInDir(
    "./dist",
    /new URL\('\.\.\/release\//g,
    "new URL('./",
    [".js"]
  );
  await findAndReplaceInDir(
    "./dist",
    /new URL\("\.\.\/release\//g,
    'new URL("./',
    [".js"]
  );
}

await main();
