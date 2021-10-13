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
      const popperEl = wrapperRef.current;
      let referenceEl = inputRef.current;
      const IS_MOBILE = window.innerWidth < 768;
      console.log(IS_MOBILE);
      if (IS_MOBILE) {
        referenceEl = {
          getBoundingClientRect: () => {
            const modal = document.querySelector("#modal-wrapper");
            const height = (modal && modal.clientHeight) || window.innerHeight;
            const y = height / 2 - popperEl.clientHeight / 2;
            const x = window.innerWidth / 2 + popperEl.clientWidth / 2;
            return {
              width: popperEl.clientWidth,
              height: popperEl.clientHeight,
              top: y,
              left: x,
              bottom: y,
              right: x,
            };
          },
        };
      }
      popper = createPopper(referenceEl, popperEl, {
        placement: "left",
        modifiers: IS_MOBILE
          ? []
          : [
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
      className={`w-screen absolute ${
        open ? "opacity-100 ease-in" : "opacity-0 ease-out invisible"
      } transition-all duration-200`}
    >
      <div
        className="relative py-2"
        style={{
          left: window.innerWidth < 768 ? 0 : "1px",
        }}
      >
        {children}
      </div>
      <div className="hidden md:block" id="arrow" data-popper-arrow></div>
    </div>
  );
}
