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
        placeholder="Write down your memory"
        className={`w-full h-44 md:h-60 rounded focus:outline-none bg-lightestGray resize-none p-4 text-lg ${
          error && "input-error"
        }`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}
