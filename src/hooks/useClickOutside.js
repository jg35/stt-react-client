import { useEffect } from "react";

// Improved version of https://usehooks.com/useOnClickOutside/
const useClickOutside = (ref, handler, clickAreaSelector = null) => {
  useEffect(() => {
    let startedInside = false;
    let startedWhenMounted = false;
    let clickArea = document;
    if (clickAreaSelector) {
      clickArea = document.querySelector(clickAreaSelector);
    }

    const listener = (event) => {
      // Do nothing if `mousedown` or `touchstart` started inside ref element
      if (startedInside || !startedWhenMounted) return;
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) return;

      handler(event);
    };

    const validateEventStart = (event) => {
      startedWhenMounted = ref.current;
      startedInside = ref.current && ref.current.contains(event.target);
    };

    clickArea.addEventListener("mousedown", validateEventStart);
    clickArea.addEventListener("touchstart", validateEventStart);
    clickArea.addEventListener("click", listener);

    return () => {
      clickArea.removeEventListener("mousedown", validateEventStart);
      clickArea.removeEventListener("touchstart", validateEventStart);
      clickArea.removeEventListener("click", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
