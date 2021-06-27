import React, { useEffect, useState } from "react";
import Button from "~/components/button";

export default function Menu({
  items,
  toggle,
  compact = false,
  minimal = true,
}) {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

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
    <div className="relative">
      <Button minimal={minimal} onClick={() => setOpen(!open)}>
        {toggle}
      </Button>
      {open && (
        <div
          style={{ boxShadow: "0 0 6px 2px rgba(0, 0, 0, 0.1)" }}
          className={`absolute right-0 top-9 flex flex-col items-end rounded z-30 bg-white  ${
            compact ? "w-44" : "w-64"
          }`}
        >
          {menuItems.map((item, itemIndex) => {
            const stateCss = [];
            if (itemIndex === 0) {
              stateCss.push("rounded-t-lg");
            } else if (itemIndex === items.length - 1) {
              stateCss.push("rounded-b-lg");
            }

            if (item.seperator && itemIndex !== items.length - 1) {
              stateCss.push("border-b border-lightGray");
            }

            return (
              <div
                key={itemIndex}
                className={`w-full hover:bg-lightestGray text-right cursor-pointer min-h-10 flex justify-right items-center w-full ${stateCss}`}
                onClick={() => handleItemClick(item)}
              >
                {item.component}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
