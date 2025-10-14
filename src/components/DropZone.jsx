import React, { useState, useCallback } from "react";

export default function DropZone({ onFiles }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files)
      .filter(f => f.type.startsWith("image/"));

    const urls = files.map(f => URL.createObjectURL(f));
    onFiles(urls);
  }, [onFiles]);

  return (
    <div
      className={`dropzone ${isDragging ? "dragging" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      style={{
        border: "3px dashed #ccc",
        padding: "2rem",
        margin: "1rem auto",
        textAlign: "center",
        width: "90%",
        maxWidth: "600px",
        background: isDragging ? "#eee" : "#fff",
      }}
    >
      {isDragging ? "Release to upload photos" : "Drag & drop photos or folders here"}
    </div>
  );
}
