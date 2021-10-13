import { useRef } from "react";
import { motion } from "framer-motion";
import useClickOutside from "~/hooks/useClickOutside";

export default function DateFinderWrapper({ open, children, closeHandler }) {
  const wrapperRef = useRef(null);
  useClickOutside(wrapperRef, (e) => {
    if (open && !(e.target.id && e.target.id === "tooltip")) {
      closeHandler();
    }
  });
  return (
    <motion.div
      ref={wrapperRef}
      initial="hidden"
      animate={open ? "visible" : "hidden"}
      transition={{ duration: 0.3 }}
      variants={{
        visible: {
          opacity: 1,
          height: "auto",
          left: [20, 20, 0],
          borderRadius: "6px",
        },
        hidden: {
          opacity: [1, 0],
          width: 0,
          height: 0,
          left: 20,
          borderRadius: "50%",
          transition: {
            delay: 0.2,
          },
        },
      }}
      id="tooltip"
      style={{
        width: "100%",
        top: "50%",
        transform: "translateY(-50%)",
      }}
      className={`absolute hidden shadow-md bg-lightestGray z-50`}
    >
      <motion.div
        animate={open ? "visible" : "hidden"}
        initial="hidden"
        variants={{
          visible: { opacity: 1, transition: { delay: 0.5 } },
          hidden: { opacity: 0 },
        }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
