import { joinTailwindClasses } from "~/lib/util";

export default function Card({
  children,
  style = {},
  css = "",
  variant = "default",
  size = "default",
}) {
  const variants = {
    default: "bg-white",
  };
  const sizes = {
    compact: "p-1",
    default: "p-4 rounded shadow md:shadow-lg md:rounded-lg",
    large: "p-8 shadow-lg rounded-md md:shadow-2xl md:rounded-lg",
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
