import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

import ctrlWrapper from "../helpers/controllerWrapper.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 10 } = req.query;

  const skip = (page - 1) * limit;

  const result = await Contact.find({ owner }, null, { skip, limit });
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;

  const { _id: owner } = req.user;

  const result = await Contact.findOne({ _id: id, owner });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;

  const { _id: owner } = req.user;

  const result = await Contact.findOneAndDelete({ _id: id, owner });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json({
    message: "Deleted successfully",
  });
});

export const createContact = ctrlWrapper(async (req, res) => {
  const { _id: owner } = req.user;

  const result = await Contact.create({ ...req.body, owner });

  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;

  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate({ _id: id, owner }, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const updateStatusContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;

  const { _id: owner } = req.user;

  const result = await Contact.findOneAndUpdate(
    { _id: id, owner },

    { favourite },
    {
      new: true,
    }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});
