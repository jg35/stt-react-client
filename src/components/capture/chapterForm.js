import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

export default function ChapterForm({ item, setItem }) {
  const [jsDate, setJsDate] = useState(null);

  useEffect(() => {
    setJsDate(item.date ? new Date(item.date) : null);
  }, [item]);

  return (
    <div>
      <h1 className="modal-title">
        {item.id ? "Edit chapter" : "Add chapter"}
      </h1>
      <input
        className="input mb-6"
        autoFocus
        placeholder="Enter chapter name"
        type="text"
        onChange={(e) => setItem({ ...item, content: e.target.value })}
        value={item.content}
      />
      <div className="form-control">
        <label>Date</label>
        <DatePicker
          selected={jsDate}
          onChange={(newDate) => {
            setJsDate(newDate);
            setItem({
              ...item,
              date: newDate.toISOString().replace(/T.*/, ""),
              dateType: "MANUAL",
            });
          }}
        />
      </div>
    </div>
  );
}
