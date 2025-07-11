import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState("");

  const parseCSV = (text) => {
    const rows = text.trim().split("\n");
    const data = rows.slice(1).map((row) => {
      const [name, number, message] = row.split(",");
      return { name, number, message };
    });
    setContacts(data);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => parseCSV(event.target.result);
    reader.readAsText(file);
  };

  const handleSend = async () => {
    try {
      setStatus("Sending...");
      const res = await axios.post("http://localhost:5000/send-bulk", {
        contacts,
      });
      setStatus(res.data.message);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setStatus("❌ Error sending messages");
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>📢 WhatsApp Messaging Tool</h2>

      <input type="file" accept=".csv" onChange={handleUpload} />
      <br /><br />

      <button onClick={handleSend}>Send WhatsApp Messages</button>
      <p>{status}</p>

      {contacts.length > 0 && (
        <>
          <h4>📄 Preview Contacts</h4>
          <ul>
            {contacts.map((c, index) => (
              <li key={index}>
                <strong>{c.name}</strong> — {c.number} — {c.message}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default App;
