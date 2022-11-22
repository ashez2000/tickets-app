import http from "http";
import config from "./config";
import app from "./app";

async function main() {
  const server = http.createServer(app);
  server.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
  });
}

main().catch((err) => {
  console.error("Main error", err);
});
