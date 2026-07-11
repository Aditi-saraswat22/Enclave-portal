import Contact from "../models/Contact.js";
import logger from "../utils/logger.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { sendNotificationEmail } from "../utils/email.js";

/**
 * @desc    Create Contact Message
 * @route   POST /api/contact
 */
export const createContact = async (req, res, next) => {
  try {
    let attachmentData = {};

    // Upload attachment to Cloudinary if a file is provided in the request
    if (req.file) {
      logger.info(`Processing attachment upload: ${req.file.originalname}`);
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        req.file.originalname
      );
      attachmentData = {
        attachmentUrl: uploadResult.secure_url,
        attachmentPublicId: uploadResult.public_id,
      };
    }

    // Merge request body and attachment details
    const contactPayload = {
      ...req.body,
      ...attachmentData,
    };

    const contact = await Contact.create(contactPayload);

    logger.info(`New contact submitted by ${contact.email}`);

    // Asynchronously send notification email (non-blocking)
    sendNotificationEmail(contact).catch((err) => {
      logger.error(`Deferred email notification failed: ${err.message}`);
    });

    res.status(201).json({
      success: true,
      message: "Contact message submitted successfully.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Contacts (with optional query search filter)
 * @route   GET /api/contact
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search.trim(), "i");
      query = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { subject: searchRegex },
          { message: searchRegex },
        ],
      };
    }

    const contacts = await Contact.find(query).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Contact
 * @route   DELETE /api/contact/:id
 */
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    logger.info(`Contact deleted : ${req.params.id}`);

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};