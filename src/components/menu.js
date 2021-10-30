import React, { useEffect, useState, useRef } from "react";
import Button from "~/components/_styled/button";
import useClickOutside from "~/hooks/useClickOutside";

export default function Menu({
  id = "menu",
  items,
  toggle,
  compact = false,
  minimal = true,
}) {
  const menuRef = useRef();
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  useClickOutside(menuRef, () => setOpen(false));

  useEffect(() => {
    if (items && items.length) {
      setMenuItems(
        items.map((item) => {
          return {
            ...{
              component: null,
              onClick: null,
              seperator: true,
              closeOnClick: true,
            },
            ...item,
          };
        })
      );
    }
  }, [items]);

  function close() {
    setOpen(false);
  }

  function handleItemClick(item) {
    if (item.closeOnClick) {
      setOpen(false);
    }
    if (item.onClick) {
      item.onClick(close);
    }
  }
  return (
    <div id={id} className="relative" ref={menuRef}>
      <Button
        size="compact"
        css="bg-transparent border-transparent"
        variant={minimal ? "minimal" : "default"}
        onClick={() => setOpen(!open)}
      >
        {toggle}
      </Button>
      {open && (
        <div
          style={{ boxShadow: "0 0 6px 2px rgba(0, 0, 0, 0.1)" }}
          className={`absolute right-0 top-9 flex flex-col items-end rounded z-30 bg-white  ${
            compact ? "w-44" : "w-auto"
          }`}
        >
          {menuItems.map((item, itemIndex) => {
            const stateCss = [];
            if (itemIndex === 0) {
              stateCss.push("rounded-t-lg");
            } else if (itemIndex === items.length - 1) {
              stateCss.push("rounded-b-lg");
            }

            return (
              <Button
                key={itemIndex}
                variant="minimal"
                size="compact"
                css={stateCss.concat(item.buttonCss || "").join(" ")}
                onClick={() => handleItemClick(item)}
              >
                {item.component}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
