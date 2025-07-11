import React, { useState } from "react";
import axios from "axios";

function App() {
  const [contacts, setContacts] = useState([]);
  const [csvText, setCsvText] = useState("");
  const [status, setStatus] = useState("");

  const parseCSV = (text) => {
    const rows = text.trim().split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map(row => {
      const values = row.split(",");
      return {
        name: values[0],
        number: values[1],
        message: values[2],
      };
    });
    setContacts(data);
  };

  const handleUpload = (e) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvText(event.target.result);
      parseCSV(event.target.result);
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleSend = async () => {
    try {
      setStatus("Sending...");
      const res = await axios.post("http://localhost:5000/send-bulk", {
        contacts,
      });
      setStatus(res.data.message);
    } catch (error) {
      setStatus("Error sending messages");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>📢 WhatsApp Messaging Tool</h2>

      <input type="file" accept=".csv" onChange={handleUpload} />
      <br /><br />

      <button onClick={handleSend}>Send WhatsApp Messages</button>
      <p>{status}</p>

      <h4>Preview Contacts</h4>
      <ul>
        {contacts.map((c, i) => (
          <li key={i}>{c.name} - {c.number} - {c.message}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
