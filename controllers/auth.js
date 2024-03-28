import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/controllerWrapper.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import gravatar from "gravatar";
import * as path from "node:path";
import * as fs from "node:fs/promises";
import Jimp from "jimp";
import nodemailer from "nodemailer";
import crypto from "node:crypto";

const { SECRET_KEY, BASE_URL, MAILTRAP_PASSWORD, MAILTRAP_USER } = process.env;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASSWORD,
  },
});

const avatarsDir = path.join(process.cwd(), "public", "avatars");

export const register = ctrlWrapper(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomUUID();

  await transport.sendMail({
    to: email,
    from: "timahaua@gmail.com",
    subject: "Verification",
    html: `To confirm the registration please click <a href="${BASE_URL}/api/users/verify/${verificationToken}">link</a>`,
    text: `To confirm the registration please open the link ${BASE_URL}/api/users/verify/${verificationToken}`,
  });

  const avatarURL = gravatar.url("email");

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
  res.status(201).json(newUser);
});

export const verify = ctrlWrapper(async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (user === null) {
    throw HttpError(404, "User not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({
    message: "Verification successful",
  });
});

export const resendVerifyEmail = ctrlWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "Missing required field email");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  await transport.sendMail({
    to: email,
    from: "timahaua@gmail.com",
    subject: "Verification",
    html: `To confirm the registration please click <a href="${BASE_URL}/api/users/verify/${user.verificationToken}">link</a>`,
    text: `To confirm the registration please open the link ${BASE_URL}/api/users/verify/${user.verificationToken}`,
  });

  res.json({
    message: "Verification email sent",
  });
});

export const login = ctrlWrapper(async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(404, "User not found");
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
