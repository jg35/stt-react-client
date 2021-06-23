import React from "react";

export default function TextForm({ setItem, item }) {
  return (
    <>
      <h1 className="modal-title">
        {item.question
          ? item.question.title
          : `${!item.id ? "New" : "Edit"} memory`}
      </h1>
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <textarea
            autoFocus
            placeholder="Time to write"
            className="w-full h-full focus:outline-none resize-none pr-4 text-lg"
            onChange={(e) => setItem({ ...item, content: e.target.value })}
            value={item.content}
          />
        </div>
      </div>
    </>
  );
}
