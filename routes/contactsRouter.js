import express from "express";

import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavouriteSchema,
} from "../models/contact.js";

import validateBody from "../helpers/validateBody.js";
import isValideId from "../helpers/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValideId, getOneContact);

contactsRouter.delete("/:id", isValideId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.patch(
  "/:id/favorite",
  isValideId,
  validateBody(updateFavouriteSchema),
  updateStatusContact
);

contactsRouter.put(
  "/:id",
  isValideId,
  validateBody(updateContactSchema),
  updateContact
);

export default contactsRouter;
