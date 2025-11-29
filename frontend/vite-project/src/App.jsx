import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [text, setText] = useState("");
  const [oldText, setOldText] = useState("");
  const [history, setHistory] = useState([]);

  const saveVersion = async () => {
    const res = await axios.post("http://localhost:3000/save-version", {
      oldText,
      newText: text
    });

    setOldText(text);
    fetchHistory();
  };

  const fetchHistory = async () => {
    const res = await axios.get("http://localhost:3000/versions");
    setHistory(res.data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Mini Audit Trail Generator</h1>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        style={{ width: "100%", marginTop: 10 }}
        placeholder="Type something..."
      />

      <button
        onClick={saveVersion}
        style={{ marginTop: 10, padding: "10px 20px" }}
      >
        Save Version
      </button>

      <h2 style={{ marginTop: 30 }}>Version History</h2>

      {history.map((v) => (
        <div key={v.id} style={{ border: "1px solid #ccc", padding: 15, marginTop: 10 }}>
          <p><b>ID:</b> {v.id}</p>
          <p><b>Timestamp:</b> {new Date(v.timestamp).toLocaleString()}</p>
          <p><b>Added Words:</b> {v.addedWords.join(", ") || "None"}</p>
          <p><b>Removed Words:</b> {v.removedWords.join(", ") || "None"}</p>
          <p><b>Old Length:</b> {v.oldLength}</p>
          <p><b>New Length:</b> {v.newLength}</p>
        </div>
      ))}
    </div>
  );
}
