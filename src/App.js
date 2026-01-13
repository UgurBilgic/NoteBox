import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [dark, setDark] = useState(false);
  const [search, setSearch] = useState("");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    document.body.className = dark ? "dark" : "light";
  }, [dark]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) setNotes(storedNotes);
  }, []);

  const addNote = () => {
    if (!note.trim()) return;
    const today = new Date();
    const formatted = today.toLocaleDateString("tr-TR");
    const updated = [{ text: note, date: formatted, pinned: false }, ...notes];
    setNotes(updated);
    setNote("");
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  const deleteNote = (i) => {
    if (!window.confirm("Bu notu silmek istediğine emin misin?")) return;
    const updated = notes.filter((_, index) => index !== i);
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  const togglePin = (i) => {
    const updated = notes
      .map((n, idx) => (idx === i ? { ...n, pinned: !n.pinned } : n))
      .sort((a, b) => b.pinned - a.pinned);

    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
  };

  const startEdit = (i) => {
    setEditingIndex(i);
    setEditingText(notes[i].text);
  };

  const finishEdit = (i) => {
    if (!editingText.trim()) return;
    const updated = notes.map((n, idx) =>
      idx === i ? { ...n, text: editingText } : n
    );
    setNotes(updated);
    localStorage.setItem("notes", JSON.stringify(updated));
    setEditingIndex(null);
    setEditingText("");
  };

  const handleInlineKey = (e, index) => {
    if (e.key === "Enter") finishEdit(index);
    if (e.key === "Escape") {
      setEditingIndex(null);
      setEditingText("");
    }
  };

  return (
    <div className="container">
      <button className="theme-toggle" onClick={() => setDark(!dark)}></button>

      <div className="search-box-left">
        <input
          className="search-left-input"
          placeholder="Notlarda ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

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
          {notes
            .filter((n) => n.text.toLowerCase().includes(search.toLowerCase()))
            .map((n, index) => (
              <li key={index} className="note-item">
                <span className="note-date">{n.date}</span>

                <div className="note-content">
                  <span className="pin-btn" onClick={() => togglePin(index)}>
                    {n.pinned ? "📌" : "📍"}
                  </span>

                  {editingIndex === index ? (
                    <input
                      className="note-edit-input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => handleInlineKey(e, index)}
                      autoFocus
                    />
                  ) : (
                    <span className="note-text">{n.text}</span>
                  )}
                </div>

                <div className="note-actions bottom">
                  {editingIndex === index ? (
                    <button
                      className="edit-btn"
                      onClick={() => finishEdit(index)}
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(index)}
                    >
                      ✎
                    </button>
                  )}
                  <button
                    className="delete-btn"
                    onClick={() => deleteNote(index)}
                  >
                    x
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
