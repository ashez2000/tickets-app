import { Router } from "express";
import * as auth from "./auth.controller";
import * as schema from "./auth.schema";

const router = Router();

router.post("/register", schema.registerSchema, auth.register);
router.post("/login", schema.loginSchema, auth.login);
router.post("/logout", auth.logout);
router.get("/user", auth.user);

export default router;
