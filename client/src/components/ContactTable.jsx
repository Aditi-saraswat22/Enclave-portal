function ContactTable({
  contacts,
  onDelete,
}) {
  if (contacts.length === 0) {
    return (
      <div className="empty-state">
        <h3>No Contacts Found</h3>

        <p>
          No users have submitted the contact
          form yet.
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">

      <table className="contact-table">

        <thead>

          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Attachment</th>
            <th>Date</th>
            <th>Action</th>
          </tr>

        </thead>

        <tbody>

          {contacts.map((contact) => (
            <tr key={contact._id}>

              <td>{contact.name}</td>

              <td>{contact.email}</td>

              <td>{contact.subject}</td>

              <td>
                {contact.attachmentUrl ? (
                  <a
                    href={contact.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: "bold",
                      color: "var(--blue)",
                      textDecoration: "underline",
                    }}
                  >
                    <svg
                      style={{ width: "16px", height: "16px", stroke: "currentColor", strokeWidth: 2, fill: "none" }}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                      />
                    </svg>
                    View
                  </a>
                ) : (
                  <span style={{ color: "#999" }}>-</span>
                )}
              </td>

              <td>
                {new Date(
                  contact.createdAt
                ).toLocaleDateString()}
              </td>

              <td>

                <button
                  className="delete-btn"
                  onClick={() =>
                    onDelete(contact._id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
}

export default ContactTable;