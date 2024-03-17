import Joi from "joi";
import mongoose from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required().email(),
  subscription: Joi.string(),
});
export const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().required().email(),
});

export default mongoose.model("User", userSchema);
