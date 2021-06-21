import React, { useState } from "react";
import Button from "./button";

export default function Menu({ sections, toggle, compact = false }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button css="bg-transparent" onClick={() => setOpen(!open)} minimal>
        {toggle}
      </Button>
      {open && (
        <div
          style={{ boxShadow: "0 0 12px 2px rgba(0, 0, 0, 0.1)" }}
          className={`animate-fade-in absolute right-0 flex flex-col items-end rounded-lg z-10 bg-white  ${
            compact ? "w-40" : "w-64"
          }`}
        >
          {sections.map((sectionItems, sectionIndex) => (
            <div
              key={sectionIndex}
              className={`w-full ${
                sectionIndex !== sections.length - 1 &&
                "border-b border-lightGray "
              }`}
            >
              {sectionItems.map((item, itemIndex) => {
                let radiusCss = "";
                if (sectionIndex === 0 && itemIndex === 0) {
                  radiusCss = "rounded-t-lg";
                } else if (
                  sectionIndex === sections.length - 1 &&
                  itemIndex === sectionItems.length - 1
                ) {
                  radiusCss = "rounded-b-lg";
                }
                return (
                  <div
                    key={itemIndex}
                    className={`hover:bg-lightestGray text-right cursor-pointer min-h-10 flex justify-right items-center w-full ${
                      compact ? "p-1" : "p-2"
                    } ${radiusCss}`}
                    onClick={() => setOpen(false)}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
