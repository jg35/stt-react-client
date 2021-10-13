import { useRef, useEffect } from "react";
import useClickOutside from "~/hooks/useClickOutside";
import { createPopper } from "@popperjs/core";

const showAfterChangeModifier = {
  name: "showAfterChange",
  enabled: true,
  phase: "afterWrite",
  fn({ state }) {
    state.elements.popper.classList.remove("hidden");
    state.elements.popper.classList.add("animate-fade-in");
  },
};

export default function DateFinderWrapper({
  open,
  children,
  closeHandler,
  inputRef,
  insideModal,
}) {
  const wrapperRef = useRef(null);
  useClickOutside(
    wrapperRef,
    (e) => {
      const isToggle =
        (e.target.id && e.target.id === "findDateBtn") ||
        (e.target.closest("button") &&
          e.target.closest("button").id === "findDateBtn");
      const isTooltip = e.target.id && e.target.id === "tooltip";
      if (open && !(isTooltip || isToggle)) {
        closeHandler();
      }
    },
    insideModal ? "#modal-wrapper" : null
  );
  useEffect(() => {
    let popper;
    if (wrapperRef.current && inputRef.current) {
      popper = createPopper(inputRef.current, wrapperRef.current, {
        placement: "left",
        modifiers: [
          {
            name: "arrow",
          },
          {
            name: "offset",
            options: {
              offset: [0, 12],
            },
          },
          showAfterChangeModifier,
        ],
      });
    }
    return () => {
      if (popper) {
        popper.destroy();
      }
    };
  }, [wrapperRef, inputRef]);

  return (
    <div
      ref={wrapperRef}
      id="tooltip"
      style={{
        width: "360px",
        zIndex: open ? 50 : -1,
      }}
      className={`absolute ${
        open ? "opacity-100 ease-in" : "opacity-0 ease-out invisible"
      } transition-all duration-200`}
    >
      <div
        className="relative py-2"
        style={{
          left: "1px",
        }}
      >
        {children}
      </div>
      <div id="arrow" data-popper-arrow></div>
    </div>
  );
}
