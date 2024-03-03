import express, { Router } from "express";

import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../models/user.js";
import { register } from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

export default authRouter;
