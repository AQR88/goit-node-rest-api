import User from "../models/user.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/controllerWrapper.js";

export const register = ctrlWrapper(async (res, req) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
});
