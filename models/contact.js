import Joi from "joi";
import mongoose from "mongoose";
import handleMongooseError from "../helpers/handleMongooseError.js";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handleMongooseError);

export const updateFavouriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().min(4).required().email(),
  phone: Joi.string().min(4).required(),
  favorite: Joi.boolean().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2),
  email: Joi.string().min(4).email(),
  phone: Joi.string().min(4),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field");

export default mongoose.model("Contact", contactSchema);
