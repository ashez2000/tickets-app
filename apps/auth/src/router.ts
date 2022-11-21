import { Router } from "express";
import * as auth from "./controller";

const router = Router();

router.post("/register", auth.register);
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/user", auth.user);

export default router;
