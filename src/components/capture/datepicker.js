import React, { useState, useEffect } from "react";
import ReactDatePicker from "react-datepicker";

export default function DatePicker({ onChange, date }) {
  const [jsDate, setJsDate] = useState(null);

  useEffect(() => {
    if (!jsDate) {
      setJsDate(date ? new Date(date) : null);
    }
  }, [date]);

  return (
    <ReactDatePicker
      selected={jsDate}
      onChange={(newDate) => {
        setJsDate(newDate);
        onChange(newDate);
      }}
    />
  );
}
