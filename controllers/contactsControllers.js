import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/controllerWrapper.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const result = await Contact.find();
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Deleted successfully",
  });
});

export const createContact = ctrlWrapper(async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});
