import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";

export default function EventForm({ item, setItem }) {
  const [jsDate, setJsDate] = useState(null);

  useEffect(() => {
    setJsDate(item.date ? new Date(item.date) : new Date());
  }, [item]);

  // TODO - datepicker earliest date should be DOB, latest date should be current date
  return (
    jsDate && (
      <>
        <h1 className="modal-title">{item.id ? "Edit event" : "Add event"}</h1>
        <div className="form-control">
          <label>Name</label>
          <input
            autoFocus
            placeholder="Enter event name"
            className="input mb-2 mt-1"
            type="text"
            onChange={(e) => setItem({ ...item, title: e.target.value })}
            value={item.title}
          />
        </div>
        <div className="form-control">
          <label>Date</label>
          <DatePicker
            selected={jsDate}
            onChange={(newDate) => {
              setJsDate(newDate);
              setItem({
                ...item,
                date: newDate.toISOString().replace(/T.*/, ""),
              });
            }}
          />
        </div>
      </>
    )
  );
}
