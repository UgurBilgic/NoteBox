import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) setNotes(storedNotes);
  }, []);

  const addNote = () => {
    if (!note.trim()) return;
    const updated = [...notes, note];
    setNotes(updated);
    setNote("");
    localStorage.setItem("notes", JSON.stringify(updated));
  };
  const deleteNote = (i) => {
    const updated = notes.filter((_, index) => index !== i);
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">NoteBox</h1>

        <div className="input-row">
          <input
            className="input"
            value={note}
            placeholder="Not yaz..."
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addNote()}
          />
          <button className="button" onClick={addNote}>
            +
          </button>
        </div>

        <ul className="note-list">
          {notes.map((n, index) => (
            <li key={index} className="note-item">
              {n}
              <button className="delete-btn" onClick={() => deleteNote(index)}>
                x
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
