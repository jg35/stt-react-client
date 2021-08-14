import { joinTailwindClasses } from "~/lib/util";

export default function Card({
  children,
  style = {},
  css = "",
  variant = "default",
  size = "default",
}) {
  const variants = {
    default: "bg-white flex flex-col",
  };
  const sizes = {
    compact: "p-2",
    default: "p-4 shadow-lg rounded-lg",
    large: "p-6 shadow-2xl rounded-lg",
  };

  return (
    <div
      className={joinTailwindClasses([variants[variant], sizes[size], css])}
      style={style}
    >
      {children}
    </div>
  );
}
