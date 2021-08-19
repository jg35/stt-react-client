import React, { useCallback, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";

import { Button } from "~/components/_styled";
import useClickOutside from "~/hooks/useClickOutside";

export default function PopoverPicker({
  color,
  onChange,
  x = "right-0",
  y = "top-8",
}) {
  const popover = useRef();
  const [isOpen, toggle] = useState(false);

  const close = useCallback(() => toggle(false), []);
  useClickOutside(popover, close);

  return (
    <div className="relative">
      <Button
        css="h-7 w-7 border-lightGray"
        style={{ backgroundColor: color, borderRadius: "50%" }}
        onClick={() => toggle(!isOpen)}
      />

      {isOpen && (
        <div className={`absolute ${x} ${y} z-50`} ref={popover}>
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
}
