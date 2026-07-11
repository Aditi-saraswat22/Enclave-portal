import { Router } from "express";
import {createContact,deleteContact,getAllContacts,} from "../controllers/contact.controller.js";
import validate from "../middlewares/validate.middleware.js";
import contactLimiter from "../middlewares/rateLimit.middleware.js";
import contactSchema from "../schemas/contact.schema.js";
import upload from "../middlewares/upload.middleware.js";

const router = Router();

router.post("/", contactLimiter, upload.single("attachment"), validate(contactSchema), createContact);

export default router;