import contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";
import ctrlWrapper from "../helpers/controllerWrapper.js";
import validateBody from "../helpers/validateBody.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
  const result = await contactsService.listContacts();
  res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.getContactById(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.json({
    message: "Delete success",
  });
});

export const createContact = ctrlWrapper(async (req, res) => {
  validateBody(createContactSchema);
  const result = await contactsService.addContact(req.body);
  res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
  validateBody(updateContactSchema);

  const { id } = req.params;
  const result = await contactsService.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});
