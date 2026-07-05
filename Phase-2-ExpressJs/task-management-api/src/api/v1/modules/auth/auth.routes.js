import { Router } from "express";
import { login, register } from "./auth.controller.js";
import { validateLogin } from "./middlewares/validateLogin.middleware.js";
import { validateRegister } from "./middlewares/validateRegister.middleware.js";

const router = Router();

router.post("/login", validateLogin, login);

router.post("/register", validateRegister, register);

export default router;
