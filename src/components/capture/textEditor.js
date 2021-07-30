import React, { useState } from "react";

const placeholders = [];

export default function TextEditor({
  name,
  handleBlur,
  handleChange,
  value,
  onKeyUp,
  error,
}) {
  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length) + 1]
  );

  return (
    <div className="flex-1">
      <textarea
        id="form-text-editor"
        name={name}
        onKeyUp={onKeyUp}
        autoFocus
        onFocus={function (e) {
          var val = e.target.value;
          e.target.value = "";
          e.target.value = val;
        }}
        style={{ minHeight: "200px" }}
        placeholder="Write down your memory"
        className={`w-full h-full rounded focus:outline-none bg-lightestGray resize-none p-4 text-xl ${
          error && "input-error"
        }`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}
