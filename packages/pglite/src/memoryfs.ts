import { FilesystemBase, PGDATA, copyDir } from "./fs.js";
import type { FS, EmPostgres } from "../release/postgres.js";
import loadPgShare from "../release/share.js";
import { initDb } from "./initdb.js";
import { nodeValues } from "./utils.js";

const PGWASM_URL = new URL("../release/postgres.wasm", import.meta.url);
const PGSHARE_URL = new URL("../release/share.data", import.meta.url);

export class MemoryFS extends FilesystemBase {
  initModule?: any;

  /**
   * Asynchronously initializes the module by calling the 'initDb' function and assigning the result to 'this.initModule'.
   * @throws {Error} Throws an error if the initialization process fails.
   */
  async init() {
    this.initModule = await initDb();
  }

  /**
   * Asynchronously sets options for Emscripten Postgres.
   * @param opts - Partial<EmPostgres> - The options to be set.
   * @throws - Throws an error if there is an issue with mounting the filesystem and Postgres stalls.
   * @returns - Promise<Partial<EmPostgres>> - A promise that resolves with the set options.
   */
  async emscriptenOpts(opts: Partial<EmPostgres>) {
    const options: Partial<EmPostgres> = {
      ...opts,
      preRun: [
        (mod: any) => {
          /**
           * There is an issue with just mounting the filesystem, Postgres stalls...
           * so we need to copy the files from the memory filesystem to the main fs
           */
          const proxyfs = mod.FS.filesystems.PROXYFS;
          mod.FS.mkdir(PGDATA + "_temp");
          mod.FS.mkdir(PGDATA);
          mod.FS.mount(
            proxyfs,
            { root: PGDATA + "/", fs: this.initModule.FS },
            PGDATA + "_temp",
          );
          copyDir(mod.FS, PGDATA + "_temp", PGDATA);
          mod.FS.unmount(PGDATA + "_temp");
        },
      ],
      locateFile: (base: string, _path: any) => {
        let path = "";
        if (base === "share.data") {
          path = PGSHARE_URL.toString();
        } else if (base === "postgres.wasm") {
          path = PGWASM_URL.toString();
        }
        if (path?.startsWith("file://")) {
          path = path.slice(7);
        }
        return path;
      },
    };
    const { require } = await nodeValues();
    loadPgShare(options, require);
    return options;
  }
}
