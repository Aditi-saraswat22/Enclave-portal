import { v2 as cloudinary } from "cloudinary";
import logger from "./logger.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer to Cloudinary using upload_stream.
 * Fallbacks to a mock URL if Cloudinary is not configured.
 * @param {Buffer} fileBuffer 
 * @param {string} originalName 
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
export const uploadToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const isConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (!isConfigured) {
      logger.warn("Cloudinary environment variables are not configured. Returning local/mock attachment URL.");
      return resolve({
        secure_url: `https://via.placeholder.com/150?text=${encodeURIComponent(originalName)}`,
        public_id: `mock_${Date.now()}`,
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "enclave_portal",
        resource_type: "auto", // Automatically detects images, pdfs, docs, etc.
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          reject(error);
        } else {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export default cloudinary;
