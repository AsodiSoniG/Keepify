import React, { useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import PushPinIcon from "@mui/icons-material/PushPin";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function Note(props) {
  const noteRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedContent, setEditedContent] = useState(props.content);

  function handleSave() {
    setIsEditing(false);
    props.onEdit(props.id, {
      title: editedTitle,
      content: editedContent
    });
  }

  function handleDownload() {
    html2canvas(noteRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("P", "mm", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`${props.title || "note"}.pdf`);
    });
  }



  function handleClick() {
    props.onDelete(props.id);

  }

  return (

    <div
      className={`note ${props.isDeleting ? "fade-out" : ""}`} 
      ref={(el) => {
        noteRef.current = el;
        if (props.dragRef) props.dragRef(el);
      }}
      {...props.dragProps}
      {...props.dragHandleProps}
      style={{backgroundColor: props.color, position: "relative" }}
      >


      <button onClick={props.onPin} className="pin-button">
        <PushPinIcon style={{ color: props.isPinned ? "#f5ba13" : "#bbb" }} />
      </button>

      {isEditing ? (
        <>
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <textarea
            rows="4"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{ resize: "none", flex: 1, overflowY: "auto", marginBottom: "10px" }}
          />
          <button onClick={handleSave}>
            ✅
          </button>
        </>
      ) : (
        <>
           <h1>{props.title}</h1>
      <div className="note-content">
        <p>{props.content}</p>
      </div>
      <p className="note-date">🗓️ {props.createdAt}</p>
      <div className="note-buttons">
        <button onClick={() => setIsEditing(true)}>✏️</button>
        <button onClick={handleDownload}>📥</button>
        <button onClick={handleClick}>🗑️</button>
      </div>
    </>
  )}
</div>
  );
}
export default Note;
