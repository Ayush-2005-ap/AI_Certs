const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

let versionHistory = []; 

function extractChanges(oldText, newText) {
  const oldWords = oldText.trim().split(/\s+/).filter(Boolean);
  const newWords = newText.trim().split(/\s+/).filter(Boolean);

  const oldSet = new Set(oldWords);
  const newSet = new Set(newWords);

  const added = [...newSet].filter((w) => !oldSet.has(w));
  const removed = [...oldSet].filter((w) => !newSet.has(w));

  return { added, removed };
}

app.post("/save-version", (req, res) => {
  const { oldText, newText } = req.body;

  const changes = extractChanges(oldText, newText);

  const entry = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    addedWords: changes.added,
    removedWords: changes.removed,
    oldLength: oldText.length,
    newLength: newText.length,
  };

  versionHistory.push(entry);

  res.json(entry);
});

app.get("/versions", (req, res) => {
  res.json(versionHistory);
});

app.listen(3000, () => console.log("Backend running on port 3000"));
