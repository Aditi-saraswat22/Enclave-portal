import { useState } from "react";
import { submitContact } from "../services/contact.service";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function ContactForm() {
  const [formData, setFormData] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState([]);
  const [serverMessage, setServerMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error of current field while typing
    setErrors((prev) => prev.filter((error) => error.field !== name));

    setServerMessage("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Client-side validations
    // 1. File size limit (5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File is too large. Maximum allowed size is 5MB.");
      setFile(null);
      return;
    }

    // 2. File type limit (Images, PDF, Word documents, text)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setFileError("Only JPG, PNG, GIF, WEBP, PDF, DOC, DOCX, and TXT files are allowed.");
      setFile(null);
      return;
    }

    setFileError("");
    setFile(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileError("");
  };

  const getFieldError = (fieldName) => {
    return errors.find((error) => error.field === fieldName)?.message;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setErrors([]);
    setSuccess(false);
    setServerMessage("");

    // Build FormData payload
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("subject", formData.subject);
    formDataToSend.append("message", formData.message);
    if (file) {
      formDataToSend.append("attachment", file);
    }

    try {
      const response = await submitContact(formDataToSend);

      setSuccess(true);
      setServerMessage(response.message);
      setFormData(initialForm);
      setFile(null);
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors);
      }

      setServerMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-card">
      <h2>Send us a Message</h2>

      <p className="form-description">
        Fill out the form below and we'll get back to you as soon as possible.
      </p>

      {serverMessage && (
        <div className={`alert ${success ? "alert-success" : "alert-error"}`}>
          {serverMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Full Name</label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
          />

          {getFieldError("name") && (
            <small className="error-text">{getFieldError("name")}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          {getFieldError("email") && (
            <small className="error-text">{getFieldError("email")}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject</label>

          <input
            id="subject"
            type="text"
            name="subject"
            placeholder="Need assistance"
            value={formData.subject}
            onChange={handleChange}
          />

          {getFieldError("subject") && (
            <small className="error-text">{getFieldError("subject")}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>

          <textarea
            id="message"
            name="message"
            rows="6"
            placeholder="Write your message..."
            value={formData.message}
            onChange={handleChange}
          />

          {getFieldError("message") && (
            <small className="error-text">{getFieldError("message")}</small>
          )}
        </div>

        <div className="form-group">
          <label>Attachment (Optional)</label>
          <div className="file-upload-wrapper">
            {!file ? (
              <div className="file-upload-container">
                <input
                  key="file-empty"
                  type="file"
                  className="file-upload-input"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx,.txt"
                />
                <div className="file-upload-info">
                  <svg className="file-upload-icon" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                  </svg>
                  <span>Click to upload files (PDF, JPG, PNG, DOCX, TXT)</span>
                  <small style={{ color: "#777" }}>Max size: 5MB</small>
                </div>
              </div>
            ) : (
              <div className="file-selected-box">
                <div className="file-selected-name">
                  <svg style={{ width: "20px", height: "20px", fill: "none", stroke: "currentColor", strokeWidth: 2 }} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>{file.name}</span>
                </div>
                <button
                  type="button"
                  className="file-remove-btn"
                  onClick={handleRemoveFile}
                >
                  Remove
                </button>
              </div>
            )}
            {fileError && <small className="error-text">{fileError}</small>}
          </div>
        </div>

        <button className="submit-btn" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default ContactForm;
