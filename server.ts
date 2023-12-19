import http, { Server } from "node:http";

/**
 * Represents a handle to a promise that isn't strictly associated with any
 * async operation and rather depends on the exposed `resolve()` and `reject()`
 * methods which can be used to settle it.
 */
export default class Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason: Error) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

interface ServerStartResult {
  server: Server | null;
}

function createServer() {
  const server = http.createServer();
  const deferredStartServerResult = new Deferred<ServerStartResult>();

  server.on("error", (error) => {
    console.log("error", error);
    deferredStartServerResult.resolve({
      server: null,
    });
  });

  server.listen(7000, "0.0.0.0", () => {
    console.log("✅ Staring server completed!");
    deferredStartServerResult.resolve({
      server,
    });
  });

  return deferredStartServerResult.promise;
}

const closeServer = async (server: Server): Promise<void> =>
  new Promise((resolve) => {
    server.on("close", () => {
      console.log("🛑 Stopping server completed!");
      resolve();
    });

    server.close();
  });

for (let i = 0; i < 4; i++) {
  const server = await createServer();

  if (server.server) {
    await closeServer(server.server);
  }
}
