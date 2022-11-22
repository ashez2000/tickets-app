import express from "express";
import cookieSession from "cookie-session";

import router from "./router";
import errorHandler from "./error-handler";

async function main() {
  const app = express();

  app.use(cookieSession({ signed: false }));

  app.use(express.json());
  app.use("/api/auth", router);
  app.use(errorHandler);

  const server = app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

main().catch((err) => {
  console.error("Main error", err);
});
