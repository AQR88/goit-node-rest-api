import express, { Router } from "express";

import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../models/user.js";
import {
  register,
  login,
  logout,
  currentUser,
  updateAvatar,
} from "../controllers/auth.js";
import authenticate from "../helpers/authenticate.js";
import upload from "../helpers/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);

authRouter.post("/login", validateBody(loginSchema), login);

authRouter.get("/current", authenticate, currentUser);

authRouter.post("/logout", authenticate, logout);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  updateAvatar
);

export default authRouter;
