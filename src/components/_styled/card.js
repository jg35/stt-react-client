import { joinTailwindClasses } from "~/lib/util";

export default function Card({
  children,
  style = {},
  css = "",
  variant = "default",
  size = "default",
}) {
  const variants = {
    default: "bg-white flex flex-col shadow-lg rounded-lg",
  };
  const sizes = {
    compact: "p-2",
    default: "p-4",
    large: "p-6",
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
