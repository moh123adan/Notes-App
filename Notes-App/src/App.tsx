import React, { useState, useEffect } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  type Note = {
    id: number;
    title: string;
    content: string;
  };

  const [notes, setNotes] = useState<Note[]>([]);

  const handleAddNote = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const newNote = await response.json();

      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (error) {
      console.log(error);
    }
    // console.log("title", title);
    // console.log("content", content);

    // const newNote: Note = {
    //   id: notes.length + 1,
    //   title: title,
    //   content: content,
    // };

    setNotes([newNote, ...notes]);
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");

        const notes: Note[] = await response.json();

        setNotes(notes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchNotes();
  }, []);

  const handleUpdateNote = async (event: React.FocusEvent) => {
    event.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes ${selectedNote.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const updatedNote = await response.json();
      const updateNoteList = notes.map((note) =>
        note.id === selectedNote.id ? updatedNote : note
      );

      setNotes(updateNoteList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      alert("An error occurred while updating the note.");
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  //delete notes
  const deleteNote = async (event: React.MouseEvent, noteId: number) => {
    event.stopPropagation();

    try {
      await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: "DELETE",
      });
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      setNotes(updatedNotes);
    } catch (error) {}
  };

  return (
    <div className="app-container">
      <form
        onSubmit={(event) =>
          selectedNote ? handleAddNote(event) : handleAddNote(event)
        }
        className="note-form"
      >
        <input
          value={title}
          onChange={(event) => setTitle(event?.target.value)}
          type="text"
          placeholder="note title"
          required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event?.target.value)}
          placeholder="note content"
          rows={10}
          required
        ></textarea>

        {selectedNote ? (
          <div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <button type="submit">Add Note</button>
        )}
      </form>

      <div className="note-grid">
        {notes.map((note) => (
          <div className="note-item" onClick={() => handleNoteClick(note)}>
            <div className="note-header">
              <button onClick={(event) => deleteNote(event, note.id)}>X</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
