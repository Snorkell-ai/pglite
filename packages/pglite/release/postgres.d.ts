/** Based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/emscripten/index.d.ts */
/** Other WebAssembly declarations, for compatibility with older versions of Typescript */
declare namespace WebAssembly {
  interface Module {}
}

declare namespace Emscripten {
  interface FileSystemType {}
  type EnvironmentType = "WEB" | "NODE" | "SHELL" | "WORKER";

  type JSType = "number" | "string" | "array" | "boolean";
  type TypeCompatibleWithC = number | string | any[] | boolean;

  type CIntType = "i8" | "i16" | "i32" | "i64";
  type CFloatType = "float" | "double";
  type CPointerType =
    | "i8*"
    | "i16*"
    | "i32*"
    | "i64*"
    | "float*"
    | "double*"
    | "*";
  type CType = CIntType | CFloatType | CPointerType;

  type WebAssemblyImports = Array<{
    name: string;
    kind: string;
  }>;

  type WebAssemblyExports = Array<{
    module: string;
    name: string;
    kind: string;
  }>;

  interface CCallOpts {
    async?: boolean | undefined;
  }
}

export interface EmscriptenModule {
  print(str: string): void;
  printErr(str: string): void;
  arguments: string[];
  environment: Emscripten.EnvironmentType;
  preInit: Array<{ (mod: EmscriptenModule): void }>;
  preRun: Array<{ (mod: EmscriptenModule): void }>;
  postRun: Array<{ (mod: EmscriptenModule): void }>;
  onAbort: { (what: any): void };
  onRuntimeInitialized: { (): void };
  preinitializedWebGLContext: WebGLRenderingContext;
  noInitialRun: boolean;
  noExitRuntime: boolean;
  logReadFiles: boolean;
  filePackagePrefixURL: string;
  wasmBinary: ArrayBuffer;

  destroy(object: object): void;
  getPreloadedPackage(
    remotePackageName: string,
    remotePackageSize: number
  ): ArrayBuffer;
  instantiateWasm(
    imports: Emscripten.WebAssemblyImports,
    successCallback: (module: WebAssembly.Module) => void
  ): Emscripten.WebAssemblyExports;
  locateFile(url: string, scriptDirectory: string): string;
  onCustomMessage(event: MessageEvent): void;

  // USE_TYPED_ARRAYS == 1
  HEAP: Int32Array;
  IHEAP: Int32Array;
  FHEAP: Float64Array;

  // USE_TYPED_ARRAYS == 2
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;
  HEAP64: BigInt64Array;
  HEAPU64: BigUint64Array;

  TOTAL_STACK: number;
  TOTAL_MEMORY: number;
  FAST_MEMORY: number;

  addOnPreRun(cb: () => any): void;
  addOnInit(cb: () => any): void;
  addOnPreMain(cb: () => any): void;
  addOnExit(cb: () => any): void;
  addOnPostRun(cb: () => any): void;

  preloadedImages: any;
  preloadedAudios: any;

  _malloc(size: number): number;
  _free(ptr: number): void;
}

/**
 * A factory function is generated when setting the `MODULARIZE` build option
 * to `1` in your Emscripten build. It return a Promise that resolves to an
 * initialized, ready-to-call `EmscriptenModule` instance.
 *
 * By default, the factory function will be named `Module`. It's recommended to
 * use the `EXPORT_ES6` option, in which the factory function will be the
 * default export. If used without `EXPORT_ES6`, the factory function will be a
 * global variable. You can rename the variable using the `EXPORT_NAME` build
 * option. It's left to you to declare any global variables as needed in your
 * application's types.
 * @param moduleOverrides Default properties for the initialized module.
 */
type EmscriptenModuleFactory<T extends EmscriptenModule = EmscriptenModule> = (
  moduleOverrides?: Partial<T>
) => Promise<T>;

export interface FS {
  Lookup: {
    path: string;
    node: FSNode;
  };

  FSStream: {};
  FSNode: {};
  ErrnoError: {};

  ignorePermissions: boolean;
  trackingDelegate: any;
  tracking: any;
  genericErrors: any;

  filesystems: {
    NODEFS: Emscripten.FileSystemType;
    MEMFS: Emscripten.FileSystemType;
    IDBFS: Emscripten.FileSystemType;
  };

  //
  // paths
  //
  lookupPath(path: string, opts: any): Lookup;
  getPath(node: FSNode): string;

  //
  // nodes
  //
  isFile(mode: number): boolean;
  isDir(mode: number): boolean;
  isLink(mode: number): boolean;
  isChrdev(mode: number): boolean;
  isBlkdev(mode: number): boolean;
  isFIFO(mode: number): boolean;
  isSocket(mode: number): boolean;

  //
  // devices
  //
  major(dev: number): number;
  minor(dev: number): number;
  makedev(ma: number, mi: number): number;
  registerDevice(dev: number, ops: any): void;

  //
  // core
  //
  syncfs(populate: boolean, callback: (e: any) => any): void;
  syncfs(callback: (e: any) => any, populate?: boolean): void;
  mount(type: Emscripten.FileSystemType, opts: any, mountpoint: string): any;
  unmount(mountpoint: string): void;

  mkdir(path: string, mode?: number): any;
  mkdev(path: string, mode?: number, dev?: number): any;
  symlink(oldpath: string, newpath: string): any;
  rename(old_path: string, new_path: string): void;
  rmdir(path: string): void;
  readdir(path: string): any;
  unlink(path: string): void;
  readlink(path: string): string;
  stat(path: string, dontFollow?: boolean): any;
  lstat(path: string): any;
  chmod(path: string, mode: number, dontFollow?: boolean): void;
  lchmod(path: string, mode: number): void;
  fchmod(fd: number, mode: number): void;
  chown(path: string, uid: number, gid: number, dontFollow?: boolean): void;
  lchown(path: string, uid: number, gid: number): void;
  fchown(fd: number, uid: number, gid: number): void;
  truncate(path: string, len: number): void;
  ftruncate(fd: number, len: number): void;
  utime(path: string, atime: number, mtime: number): void;
  open(
    path: string,
    flags: string,
    mode?: number,
    fd_start?: number,
    fd_end?: number
  ): FSStream;
  close(stream: FSStream): void;
  llseek(stream: FSStream, offset: number, whence: number): any;
  read(
    stream: FSStream,
    buffer: ArrayBufferView,
    offset: number,
    length: number,
    position?: number
  ): number;
  write(
    stream: FSStream,
    buffer: ArrayBufferView,
    offset: number,
    length: number,
    position?: number,
    canOwn?: boolean
  ): number;
  allocate(stream: FSStream, offset: number, length: number): void;
  mmap(
    stream: FSStream,
    buffer: ArrayBufferView,
    offset: number,
    length: number,
    position: number,
    prot: number,
    flags: number
  ): any;
  ioctl(stream: FSStream, cmd: any, arg: any): any;
  readFile(
    path: string,
    opts: { encoding: "binary"; flags?: string | undefined }
  ): Uint8Array;
  readFile(
    path: string,
    opts: { encoding: "utf8"; flags?: string | undefined }
  ): string;
  readFile(path: string, opts?: { flags?: string | undefined }): Uint8Array;
  writeFile(
    path: string,
    data: string | ArrayBufferView,
    opts?: { flags?: string | undefined }
  ): void;

  //
  // module-level FS code
  //
  cwd(): string;
  chdir(path: string): void;
  init(
    input: null | (() => number | null),
    output: null | ((c: number) => any),
    error: null | ((c: number) => any)
  ): void;

  createLazyFile(
    parent: string | FSNode,
    name: string,
    url: string,
    canRead: boolean,
    canWrite: boolean
  ): FSNode;
  createPreloadedFile(
    parent: string | FSNode,
    name: string,
    url: string,
    canRead: boolean,
    canWrite: boolean,
    onload?: () => void,
    onerror?: () => void,
    dontCreateFile?: boolean,
    canOwn?: boolean
  ): void;
  createDataFile(
    parent: string | FSNode,
    name: string,
    data: ArrayBufferView,
    canRead: boolean,
    canWrite: boolean,
    canOwn: boolean
  ): FSNode;
}

declare var MEMFS: Emscripten.FileSystemType;
declare var NODEFS: Emscripten.FileSystemType;
declare var IDBFS: Emscripten.FileSystemType;

// https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
type StringToType<R extends any> = R extends Emscripten.JSType
  ? {
      number: number;
      string: string;
      array: number[] | string[] | boolean[] | Uint8Array | Int8Array;
      boolean: boolean;
      null: null;
    }[R]
  : never;

type ArgsToType<T extends Array<Emscripten.JSType | null>> = Extract<
  {
    [P in keyof T]: StringToType<T[P]>;
  },
  any[]
>;

type ReturnToType<R extends Emscripten.JSType | null> = R extends null
  ? null
  : StringToType<Exclude<R, null>>;

/**
 * Below runtime function/variable declarations are exportable by
 * -s EXTRA_EXPORTED_RUNTIME_METHODS. You can extend or merge
 * EmscriptenModule interface to add runtime functions.
 *
 * For example, by using -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
 * You can access ccall() via Module["ccall"]. In this case, you should
 * extend EmscriptenModule to pass the compiler check like the following:
 *
 * interface YourOwnEmscriptenModule extends EmscriptenModule {
 *     ccall: typeof ccall;
 * }
 *
 * See: https://emscripten.org/docs/getting_started/FAQ.html#why-do-i-get-typeerror-module-something-is-not-a-function
 */
// Below runtime function/variable declarations are exportable by
// -s EXTRA_EXPORTED_RUNTIME_METHODS. You can extend or merge
// EmscriptenModule interface to add runtime functions.
//
// For example, by using -s "EXTRA_EXPORTED_RUNTIME_METHODS=['ccall']"
// You can access ccall() via Module["ccall"]. In this case, you should
// extend EmscriptenModule to pass the compiler check like the following:
//
// interface YourOwnEmscriptenModule extends EmscriptenModule {
//     ccall: typeof ccall;
// }
//
// See: https://emscripten.org/docs/getting_started/FAQ.html#why-do-i-get-typeerror-module-something-is-not-a-function

declare function cwrap<
  I extends Array<Emscripten.JSType | null> | [],
  R extends Emscripten.JSType | null
>(
  ident: string,
  returnType: R,
  argTypes: I,
  opts?: Emscripten.CCallOpts
): (...arg: ArgsToType<I>) => ReturnToType<R>;

/**
 * Calls a function from the Emscripten module with the specified identifier, return type, argument types, and arguments.
 * @param ident The identifier of the function to call.
 * @param returnType The return type of the function.
 * @param argTypes The types of the arguments.
 * @param args The arguments to pass to the function.
 * @param opts Optional options for the function call.
 * @throws Throws an error if the function call fails.
 */
declare function ccall<
  I extends Array<Emscripten.JSType | null> | [],
  R extends Emscripten.JSType | null
>(
  ident: string,
  returnType: R,
  argTypes: I,
  args: ArgsToType<I>,
  opts?: Emscripten.CCallOpts
): ReturnToType<R>;

/**
 * Sets the value at the specified memory address.
 * 
 * @param ptr The memory address where the value will be set.
 * @param value The value to be set at the specified memory address.
 * @param type The type of the value being set.
 * @param noSafe Optional parameter to indicate whether to perform safety checks.
 * @throws Error if the memory address is invalid or if the type is not supported.
 */
declare function setValue(
  ptr: number,
  value: any,
  type: Emscripten.CType,
  noSafe?: boolean
): void;
/**
 * Retrieves the value from the specified memory address.
 * 
 * @param ptr The memory address from which to retrieve the value.
 * @param type The type of the value to retrieve.
 * @param noSafe Optional parameter to indicate whether to perform safety checks.
 * @returns The retrieved value.
 * @throws Error if the specified memory address is invalid or inaccessible.
 */
declare function getValue(
  ptr: number,
  type: Emscripten.CType,
  noSafe?: boolean
): number;

/**
 * Allocates memory for the given slab and returns a pointer to the allocated memory.
 * 
 * @param slab - The slab to allocate memory for. It can be a number array, ArrayBufferView, or a single number.
 * @param types - The type or types of the slab. It can be a single Emscripten.CType or an array of Emscripten.CType.
 * @param allocator - The allocator to use for memory allocation.
 * @param ptr - Optional. The pointer to the allocated memory. If not provided, a new memory block will be allocated.
 * @returns A pointer to the allocated memory.
 * @throws Error if memory allocation fails.
 */
declare function allocate(
  slab: number[] | ArrayBufferView | number,
  types: Emscripten.CType | Emscripten.CType[],
  allocator: number,
  ptr?: number
): number;

/**
 * Allocates memory on the stack.
 * @param size The size of the memory to allocate.
 * @throws {Error} If the allocation fails or if the size is invalid.
 * @returns The memory address of the allocated space.
 */
declare function stackAlloc(size: number): number;
/**
 * Saves the current stack pointer.
 * @returns The saved stack pointer as a number.
 */
declare function stackSave(): number;
/**
 * Restores the stack pointer to a previously saved state.
 * @param ptr The pointer to the previously saved stack state.
 * @throws This function does not throw any exceptions.
 */
declare function stackRestore(ptr: number): void;

/**
 * Converts a UTF-8 encoded string to a JavaScript string.
 * @param ptr The pointer to the start of the UTF-8 encoded string.
 * @param maxBytesToRead The maximum number of bytes to read. Optional.
 * @throws If the pointer is invalid or if an error occurs during the conversion.
 * @returns The JavaScript string representation of the UTF-8 encoded string.
 */
declare function UTF8ToString(ptr: number, maxBytesToRead?: number): string;
/**
 * Converts a string to UTF-8 encoding.
 * 
 * @param str The input string to be converted.
 * @param outPtr The pointer to the output buffer.
 * @param maxBytesToRead The maximum number of bytes to read.
 * @throws Error if the conversion fails.
 */
declare function stringToUTF8(
  str: string,
  outPtr: number,
  maxBytesToRead?: number
): void;
/**
 * Returns the number of bytes required to encode the given string in UTF-8.
 * @param str The input string to calculate the length of in bytes.
 * @throws This function does not throw any exceptions.
 */
declare function lengthBytesUTF8(str: string): number;
/**
 * Allocates memory for a string encoded as UTF-8 and returns a pointer to the allocated memory.
 * 
 * @param str The string to be encoded as UTF-8 and allocated memory for.
 * @returns A number representing the pointer to the allocated memory.
 * @throws If the allocation fails or if the input string is empty.
 */
declare function allocateUTF8(str: string): number;
/**
 * Allocates space on the stack for a UTF-8 encoded string.
 * 
 * @param str The input string to be allocated on the stack.
 * @returns The number of bytes allocated for the UTF-8 encoded string on the stack.
 * @throws This function does not throw any exceptions.
 */
declare function allocateUTF8OnStack(str: string): number;
/**
 * Converts a UTF-16 encoded string to a JavaScript string.
 * @param ptr The pointer to the UTF-16 encoded string.
 * @throws If the ptr is not a valid number.
 * @returns The JavaScript string converted from the UTF-16 encoded string.
 */
declare function UTF16ToString(ptr: number): string;
/**
 * Converts a string to UTF-16 encoding and writes the result to a specified memory location.
 * 
 * @param str The input string to be converted to UTF-16 encoding.
 * @param outPtr The memory location where the UTF-16 encoded result will be written.
 * @param maxBytesToRead Optional. The maximum number of bytes to read from the input string. If not provided, the entire string will be converted.
 * @throws {Error} Throws an error if the conversion fails or if the memory location is invalid.
 */
declare function stringToUTF16(
  str: string,
  outPtr: number,
  maxBytesToRead?: number
): void;
/**
 * Returns the number of bytes required to encode the given string in UTF-16.
 * 
 * @param str The input string to calculate the length for.
 * @returns The number of bytes required to encode the given string in UTF-16.
 * @throws This function does not throw any exceptions.
 */
declare function lengthBytesUTF16(str: string): number;
/**
 * Converts a UTF-32 encoded string to a JavaScript string.
 * @param ptr The pointer to the UTF-32 encoded string.
 * @throws If the pointer is invalid or points to an unsupported encoding, an exception is thrown.
 * @returns The JavaScript string representation of the UTF-32 encoded string.
 */
declare function UTF32ToString(ptr: number): string;
/**
 * Converts a string to UTF-32 encoding.
 * 
 * @param str The input string to be converted.
 * @param outPtr The pointer to the output buffer.
 * @param maxBytesToRead The maximum number of bytes to read.
 * @throws Error if the conversion fails.
 */
declare function stringToUTF32(
  str: string,
  outPtr: number,
  maxBytesToRead?: number
): void;
/**
 * Returns the number of bytes required to encode the given string in UTF-32.
 * 
 * @param str The input string to calculate the length for.
 * @returns The number of bytes required to encode the input string in UTF-32.
 * @throws This function does not throw any exceptions.
 */
declare function lengthBytesUTF32(str: string): number;

/**
 * Converts a string to an array of integers.
 * 
 * @param stringy The input string to convert to an array of integers.
 * @param dontAddNull Optional. If true, null values will not be added to the resulting array.
 * @param length Optional. The length of the resulting array.
 * @throws Error if the input string is not valid or if an error occurs during conversion.
 * @returns An array of integers converted from the input string.
 */
declare function intArrayFromString(
  stringy: string,
  dontAddNull?: boolean,
  length?: number
): number[];
/**
 * Converts an array of integers to a string.
 * 
 * @param array - The array of integers to be converted to a string.
 * @returns A string representation of the input array of integers.
 * @throws If the input array is empty or contains non-numeric values.
 */
declare function intArrayToString(array: number[]): string;
/**
 * Writes a string to the specified memory buffer.
 * 
 * @param str The string to be written to memory.
 * @param buffer The memory buffer where the string will be written.
 * @param dontAddNull If true, the null terminator will not be added to the end of the string.
 * 
 * @throws {Error} If the memory buffer is invalid or inaccessible.
 */
declare function writeStringToMemory(
  str: string,
  buffer: number,
  dontAddNull: boolean
): void;
/**
 * Writes the given array to the specified memory buffer.
 * 
 * @param array The array of numbers to be written to memory.
 * @param buffer The memory buffer where the array will be written.
 * @throws Error if the buffer is not a valid memory location.
 */
declare function writeArrayToMemory(array: number[], buffer: number): void;
/**
 * Writes the ASCII representation of the given string to the specified memory buffer.
 * @param str The input string to be written to memory as ASCII.
 * @param buffer The memory buffer to write the ASCII representation of the string to.
 * @param dontAddNull A boolean flag indicating whether to add a null terminator at the end of the written string.
 * @throws Error if the memory buffer is invalid or inaccessible.
 */
declare function writeAsciiToMemory(
  str: string,
  buffer: number,
  dontAddNull: boolean
): void;

/**
 * Adds a run dependency with the specified ID.
 * 
 * @param id The ID of the run dependency to be added.
 * @throws {any} Throws an exception if the ID is not valid.
 */
declare function addRunDependency(id: any): void;
/**
 * Removes a run dependency with the specified ID.
 * 
 * @param id The ID of the run dependency to be removed.
 * @throws {Error} If the specified ID is not valid or if an error occurs while removing the run dependency.
 */
declare function removeRunDependency(id: any): void;

/**
 * Adds a new function to the list of called functions and returns the number of functions in the list.
 * @param func The function to be added to the list of called functions.
 * @param signature Optional signature of the function.
 * @returns The number of functions in the list after adding the new function.
 * @throws {Error} If the provided function is not valid.
 */
declare function addFunction(
  func: (...args: any[]) => any,
  signature?: string
): number;
/**
 * Removes the function pointed to by the specified function pointer.
 * 
 * @param funcPtr The pointer to the function to be removed.
 * @throws Error if the function pointer is invalid or points to a non-existent function.
 */
declare function removeFunction(funcPtr: number): void;

declare var ALLOC_NORMAL: number;
declare var ALLOC_STACK: number;
declare var ALLOC_STATIC: number;
declare var ALLOC_DYNAMIC: number;
declare var ALLOC_NONE: number;

export interface EmPostgres extends EmscriptenModule {
  FS: FS;
  eventTarget: EventTarget;
  Event: typeof CustomEvent;
  onRuntimeInitialized: (Module: EmPostgres) => Promise<void>;
}

/**
 * Creates a new instance of EmPostgres with the provided options.
 * @param opts Optional partial options for EmPostgres.
 * @param __dirname The directory name.
 * @param require A function for requiring modules.
 * @returns A promise that resolves to an instance of EmPostgres.
 * @throws {Error} If there is an error creating the EmPostgres instance.
 */
function EmPostgresFactory(
  opts?: Partial<EmPostgres>,
  __dirname?: any,
  require?: (string) => any
): Promise<EmPostgres>;

export default EmPostgresFactory;
