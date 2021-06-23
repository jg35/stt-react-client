import React from "react";

export default function ChapterForm({ item, setItem }) {
  return (
    <div>
      <h1 className="modal-title">
        {item.id ? "Edit chapter" : "Add chapter"}
      </h1>
      <input
        className="input"
        autoFocus
        placeholder="Enter chapter name"
        type="text"
        onChange={(e) => setItem({ ...item, content: e.target.value })}
        value={item.content}
      />
    </div>
  );
}
