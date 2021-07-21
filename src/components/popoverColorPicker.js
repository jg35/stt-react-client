import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import useClickOutside from "~/hooks/useClickOutside";

export default function PopoverPicker({ color, onChange }) {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="relative">
      <div
        className="h-7 w-7 border-2 border-lightGray shadow"
        style={{ backgroundColor: color, borderRadius: "50%" }}
        onClick={() => toggle(true)}
      />

      {isOpen && (
        <div className="absolute left-0 top-8 z-50" ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
