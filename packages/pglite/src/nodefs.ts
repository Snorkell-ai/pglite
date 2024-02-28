import * as fs from "fs";
import * as path from "path";
import { FilesystemBase, PGDATA } from "./fs.js";
import { initDb } from "./initdb.js";
import loadPgShare from "../release/share.js";
import type { EmPostgres } from "../release/postgres.js";
import { nodeValues } from "./utils.js";

const PGWASM_URL = new URL("../release/postgres.wasm", import.meta.url);
const PGSHARE_URL = new URL("../release/share.data", import.meta.url);

export class NodeFS extends FilesystemBase {
  protected rootDir: string;

  
  constructor(dataDir: string) {
    super(dataDir);
    this.rootDir = path.resolve(dataDir);
  }

  /**
   * Asynchronously initializes the data directory.
   * @throws {Error} Throws an error if no data directory is specified.
   * @throws {Error} Throws an error if the PG_VERSION file already exists in the data directory.
   */
  async init() {
    if (!this.dataDir) {
      throw new Error("No datadir specified");
    }
    if (fs.existsSync(path.join(this.dataDir!, "PG_VERSION"))) {
      return;
    }
    fs.mkdirSync(this.dataDir);
    await initDb(this.dataDir);
  }

  /**
   * Asynchronously sets Emscripten options for PostgreSQL.
   * 
   * @param opts - Partial<EmPostgres> - The options to be set.
   * @returns Promise<Partial<EmPostgres>> - The modified Emscripten options.
   * @throws Error - If there is an error in setting Emscripten options.
   */
  async emscriptenOpts(opts: Partial<EmPostgres>) {
    const options: Partial<EmPostgres> = {
      ...opts,
      preRun: [
        (mod: any) => {
          const nodefs = mod.FS.filesystems.NODEFS;
          mod.FS.mkdir(PGDATA);
          mod.FS.mount(nodefs, { root: this.rootDir }, PGDATA);
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
