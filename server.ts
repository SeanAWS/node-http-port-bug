import http, { Server } from "node:http"

function createServer() {
  const server = http.createServer()

  server.on("error", (error) => {
    console.log("error", error)
  });

  server.listen(7000, '0.0.0.0', () => {
    console.log("Staring server completed!")
  });

  return server;
}

const closeServer = async (server: Server): Promise<void> =>
  new Promise((resolve, reject) => {
    server.on("close", (err: unknown) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });

    server.close();
  });


async function main() {

  for (let i = 0; i < 10; i++) {
    const server1 = createServer();
    await closeServer(server1);
  }
}

main();
