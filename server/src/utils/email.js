import nodemailer from "nodemailer";
import logger from "./logger.js";

/**
 * Sends a notification email to the administrator.
 * Fallbacks to logging to console/winston if SMTP is not configured.
 * @param {object} contact - Contact document data
 * @returns {Promise<boolean>}
 */
export const sendNotificationEmail = async (contact) => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@enclaveportal.com";
  const fromEmail = process.env.SMTP_FROM || '"Enclave Portal" <noreply@enclaveportal.com>';

  const subject = `[Enclave Contact Portal] New Message: ${contact.subject}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 3px solid #111; background-color: #fff8ef;">
      <h2 style="background-color: #ffd43b; color: #111; padding: 15px; border-bottom: 3px solid #111; margin-top: 0; text-transform: uppercase;">
        New Contact Submission
      </h2>
      <div style="padding: 10px 0;">
        <p><strong>Name:</strong> ${contact.name}</p>
        <p><strong>Email:</strong> ${contact.email}</p>
        <p><strong>Subject:</strong> ${contact.subject}</p>
        <p><strong>Date:</strong> ${new Date(contact.createdAt).toLocaleString()}</p>
      </div>
      <hr style="border: 0; border-top: 2px solid #111;" />
      <div style="padding: 10px 0;">
        <p><strong>Message:</strong></p>
        <blockquote style="background-color: #fff; padding: 15px; border: 2px solid #111; margin: 0; white-space: pre-wrap;">${contact.message}</blockquote>
      </div>
      ${
        contact.attachmentUrl
          ? `
      <hr style="border: 0; border-top: 2px solid #111;" />
      <div style="padding: 10px 0;">
        <p><strong>Attachment:</strong></p>
        <a href="${contact.attachmentUrl}" target="_blank" style="display: inline-block; background-color: #4f7cff; color: white; padding: 10px 20px; border: 2px solid #111; text-decoration: none; font-weight: bold; box-shadow: 4px 4px 0 #111;">
          View Uploaded Attachment
        </a>
      </div>
      `
          : ""
      }
      <hr style="border: 0; border-top: 2px solid #111;" />
      <p style="font-size: 12px; color: #666; margin-top: 20px;">
        Sent from the secure Enclave Contact Portal system.
      </p>
    </div>
  `;

  const isConfigured =
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS;

  if (!isConfigured) {
    logger.info(`[Email Fallback Log]
=========================================
TO: ${adminEmail}
FROM: ${fromEmail}
SUBJECT: ${subject}
BODY:
Name: ${contact.name}
Email: ${contact.email}
Subject: ${contact.subject}
Message: ${contact.message}
Attachment: ${contact.attachmentUrl || "None"}
=========================================`);
    return true;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: fromEmail,
      to: adminEmail,
      subject: subject,
      html: htmlContent,
      text: `New Contact Submission from ${contact.name} (${contact.email}). Subject: ${contact.subject}. Message: ${contact.message}. Attachment: ${contact.attachmentUrl || "None"}.`,
    });

    logger.info(`Notification email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error(`Error sending contact email: ${error.message}`);
    return false;
  }
};
