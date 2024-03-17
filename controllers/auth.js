import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/controllerWrapper.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import gravatar from "gravatar";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import Jimp from "jimp";

const { SECRET_KEY } = process.env;

const avatarsDir = path.join(process.cwd(), "public", "avatars");

export const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url("email");

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });
  res.status(201).json(newUser);
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await bcrypt.compare(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = Jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findOneAndUpdate(user._id, { token });
  res.json({ token, email, subscription });
});

export const logout = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  await User.findOneAndUpdate(_id, { token: "" });
  res.json("Logout success");
});

export const currentUser = ctrlWrapper(async (req, res) => {
  const { email, subscription } = req.user;
  res.json({
    email,
    subscription,
  });
});

export const updateAvatar = ctrlWrapper(async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, originalname);
  await fs.rename(tempUpload, resultUpload);

  const avatar = await Jimp.read(resultUpload);
  avatar.resize(250, 250).write(resultUpload);

  const avatarURL = path.join("avatars", fileName);
  await User.findOneAndUpdate(_id, { avatarURL });

  res.json({
    avatarURL,
  });
});
