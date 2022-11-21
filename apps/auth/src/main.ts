import express from "express";
import router from "./router";

async function main() {
  const app = express();

  app.use(express.json());
  app.use("/api/auth", router);

  const server = app.listen(3000, () => {
    console.log("Listening on port 3000!");
  });
}

main().catch((err) => {
  console.error("Main error", err);
});
