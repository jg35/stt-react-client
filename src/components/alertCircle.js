import { motion } from "framer-motion";
import colors from "~/lib/colors";

export default function AlertCircle({ active, position, flash = true }) {
  return (
    <motion.span
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: flash ? [0, 1, 0, 1] : 1,
          backgroundColor: colors.red,
        },
      }}
      className={`w-3 h-3 flex items-center justify-center text-sm absolute bg-red rounded-full ${position}`}
    ></motion.span>
  );
}
