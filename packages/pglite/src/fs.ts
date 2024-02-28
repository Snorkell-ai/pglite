import type { EmPostgres, FS } from "../release/postgres.js";
export const PGDATA = "/pgdata";

export interface FilesystemFactory {
  new (dataDir: string): Filesystem;
}

export interface Filesystem {
  init(): Promise<void>;
  emscriptenOpts(opts: Partial<EmPostgres>): Promise<Partial<EmPostgres>>;
  syncToFs(mod: FS): Promise<void>;
  initialSyncFs(mod: FS): Promise<void>;
}

export abstract class FilesystemBase implements Filesystem {
  protected dataDir?: string;
  
  constructor(dataDir?: string) {
    this.dataDir = dataDir;
  }
  /**
   * Initializes the abstract method.
   * @returns A Promise that resolves when the initialization is complete.
   * @throws {Error} If there is an error during initialization.
   */
  abstract init(): Promise<void>;
  /**
   * Abstract method for configuring Emscripten options.
   * 
   * @param opts - Partial<EmPostgres> - The options to configure Emscripten.
   * @returns Promise<Partial<EmPostgres>> - A promise that resolves with the configured Emscripten options.
   * @throws - This method does not throw any exceptions.
   */
  abstract emscriptenOpts(
    opts: Partial<EmPostgres>,
  ): Promise<Partial<EmPostgres>>;
  /**
   * Asynchronously synchronizes the content to the file system.
   * 
   * @param mod The FS module to synchronize with.
   * @throws {Error} If an error occurs during the synchronization process.
   */
  async syncToFs(mod: FS) {}
  /**
   * Asynchronously performs the initial synchronization for the given FS object.
   * 
   * @param mod The FS object to be synchronized.
   * @throws {Error} If an error occurs during the synchronization process.
   */
  async initialSyncFs(mod: FS) {}
}

/**
 * Copy a directory from source to destination in the filesystem.
 * 
 * @param fs The filesystem object.
 * @param src The source directory path.
 * @param dest The destination directory path.
 * @throws Error if there is an issue with reading, writing, or creating directories.
 */
// Emscripten filesystem utility functions:

export function copyDir(fs: FS, src: string, dest: string) {
  const entries = fs.readdir(src);
  for (const name of entries) {
    if (name === "." || name === "..") continue;

    const srcPath = src + "/" + name;
    const destPath = dest + "/" + name;
    if (isDir(fs, srcPath)) {
      fs.mkdir(destPath);
      copyDir(fs, srcPath, destPath);
    } else {
      const data = fs.readFile(srcPath);
      fs.writeFile(destPath, data);
    }
  }
}

/**
 * Check if the given path is a directory.
 * @param fs The file system object.
 * @param path The path to check.
 * @throws Throws an error if the path does not exist or if there is an issue accessing the file system.
 */
export function isDir(fs: FS, path: string) {
  return fs.isDir(fs.stat(path).mode);
}
