import { type EmPostgres } from "./postgres.js";

/**
 * Loads the PgShare module.
 * 
 * @param module - Partial<EmPostgres> - The module to be loaded.
 * @param require - (string) => any - The function used to require the module.
 * 
 * @returns Partial<EmPostgres> - The loaded PgShare module.
 * 
 * @throws Error - If the module cannot be loaded.
 */
function loadPgShare(
  module: Partial<EmPostgres>,
  require?: (string) => any
): Partial<EmPostgres>;

export default loadPgShare;
