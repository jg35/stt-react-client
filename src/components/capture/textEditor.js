import React, { useState } from "react";
import { Button } from "~/components/_styled";
import Svg from "~/components/svg";
import colors from "~/lib/colors";

const placeholders = [];

export default function TextEditor({
  name,
  handleBlur,
  handleChange,
  value,
  onKeyUp,
  error,
  onExpand,
  autoFocus = true,
  height = "h-44 md:h-60",
}) {
  const [expanded, setExpanded] = useState(false);
  const [placeholder] = useState(
    placeholders[Math.floor(Math.random() * placeholders.length) + 1]
  );

  return (
    <div className="flex-1 relative">
      <textarea
        id="form-text-editor"
        name={name}
        onKeyUp={(e) => {
          if (e.key === "Escape") {
            setExpanded(false);
            onExpand(false);
          }
          onKeyUp(e);
        }}
        autoFocus={autoFocus}
        onFocus={function (e) {
          var val = e.target.value;
          e.target.value = "";
          e.target.value = val;
        }}
        placeholder="Write down your memory"
        className={`focus:outline-none bg-lightestGray resize-none p-4 text-lg ${
          error && "input-error"
        } w-full ${height} rounded`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      />
      {/* <div className="absolute -right-1 bottom-2">
        <Button
          variant="minimal"
          onClick={() => {
            const expanding = !expanded;
            if (expanding) {
              document.querySelector("#form-text-editor").focus();
            }
            onExpand(expanding);
            setExpanded(expanding);
          }}
        >
          <Svg name="expand" color="offBlack" />
        </Button>
      </div> */}
    </div>
  );
}
