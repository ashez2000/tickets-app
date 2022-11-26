import express from "express";
import cookieSession from "cookie-session";

import router from "./auth/auth.router";
import errorHandler from "./error-handler";

const app = express();

app.use(cookieSession({ signed: false }));

app.use(express.json());
app.use("/api/auth", router);
app.use(errorHandler);

export default app;
