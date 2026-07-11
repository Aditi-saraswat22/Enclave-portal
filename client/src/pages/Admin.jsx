import { useEffect, useState } from "react";

import {
  getContacts,
  deleteContact,
} from "../services/contact.service";

import ContactTable from "../components/ContactTable";

function Admin() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContacts = async (searchVal = "", isInitial = false) => {
    try {
      if (isInitial) {
        setLoading(true);
      } else {
        setIsSearching(true);
      }

      const response = await getContacts(searchVal);
      setContacts(response.data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchContacts("", true);
  }, []);

  useEffect(() => {
    if (loading) return; // Skip on initial mount

    const delayDebounceFn = setTimeout(() => {
      fetchContacts(searchTerm, false);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this contact?"
    );

    if (!confirmed) return;

    try {
      await deleteContact(id);

      setContacts((prev) =>
        prev.filter(
          (contact) => contact._id !== id
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="contact-card">
        <h2>Loading contacts...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contact-card">
        <div className="alert alert-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="contact-card" style={{ maxWidth: "1000px", width: "100%" }}>

      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <p className="form-description" style={{ margin: 0 }}>
          Total Contacts : <strong>{contacts.length}</strong> {isSearching && <span style={{ marginLeft: "10px", color: "var(--blue)", fontWeight: "bold" }}>Searching...</span>}
        </p>
      </div>

      {/* Neo-brutalist Search Bar */}
      <div className="search-container" style={{ margin: "20px 0 30px 0", display: "flex", gap: "12px", width: "100%" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <input
            type="text"
            placeholder="Search by name, email, subject, message..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: "48px",
              borderWidth: "3px",
            }}
          />
          <svg
            style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              fill: "none",
              stroke: "#111",
              strokeWidth: 2.5
            }}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="delete-btn"
            style={{
              padding: "0 22px",
              height: "auto",
              display: "flex",
              alignItems: "center",
              margin: 0,
              background: "var(--yellow)",
              color: "#111",
            }}
          >
            Clear
          </button>
        )}
      </div>

      <ContactTable
        contacts={contacts}
        onDelete={handleDelete}
      />

    </div>
  );
}

export default Admin;