import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import { v4 as uuidv4 } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes"));
    if (storedNotes) {
      setNotes(storedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  function addNote(newNote) {
    const colorList = [
      "#ecf882ff", "#f89191ff", "#a4f99dff",
      "#a7ffeb", "#cd99faff", "#f585dbff"
    ];
    const randomColor = colorList[Math.floor(Math.random() * colorList.length)];
    const noteWithMeta = {
      ...newNote,
      id: uuidv4(),
      isPinned: false,
      color: randomColor,
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };
    setNotes(prevNotes => [...prevNotes, noteWithMeta]);
  }

  function deleteNote(id) {
    setDeletingId(id);
    setTimeout(() => {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
      setDeletingId(null);
    }, 200);
  }

  function editNote(id, updatedNote) {
    const updatedDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id
          ? { ...note, ...updatedNote, createdAt: updatedDate }
          : note
      )
    );
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;
    const reorderedNotes = Array.from(notes);
    const [movedNote] = reorderedNotes.splice(result.source.index, 1);
    reorderedNotes.splice(result.destination.index, 0, movedNote);
    setNotes(reorderedNotes);
  }

  return (
    <div className="app-wrapper">
      <div className="fixed-top-section">
        <Header />
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        </div>
        <CreateArea onAdd={addNote} />
      </div>

      <div className="scroll-notes-area">
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="notes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="notes-wrapper"
              >
                {[...notes]
                  .filter(note =>
                    note.title.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => b.isPinned - a.isPinned)
                  .map((noteItem, index) => (
                    <Draggable key={noteItem.id} draggableId={noteItem.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Note
                            id={noteItem.id}
                            title={noteItem.title}
                            content={noteItem.content}
                            isPinned={noteItem.isPinned}
                            color={noteItem.color}
                            onDelete={deleteNote}
                            onEdit={editNote}
                            createdAt={noteItem.createdAt}
                            isDeleting={noteItem.id === deletingId}
                            onPin={() => {
                              setNotes(prev =>
                                prev.map(note =>
                                  note.id === noteItem.id
                                    ? { ...note, isPinned: !note.isPinned }
                                    : note
                                )
                              );
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {searchTerm && notes.filter(note =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase())
        ).length === 0 && (
            <p style={{ textAlign: "center", color: "#aaa", marginTop: "30px" }}>
              😕 𝑵𝒐 𝒎𝒂𝒕𝒄𝒉𝒊𝒏𝒈 𝒏𝒐𝒕𝒆𝒔 𝒇𝒐𝒖𝒏𝒅
            </p>
          )}
      </div>

      <Footer />
      <ToastContainer position="top-center" />
    </div>
  );
}

export default App;
