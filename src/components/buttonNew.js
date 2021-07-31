import { joinTailwindClasses } from "~/lib/util";

export default function Button({
  id,
  onClick,
  children,
  css = "",
  size = "default",
  variant = "default",
  type = "button",
  disabled = false,
}) {
  const variants = {
    minimal: "bg-transparent hover:bg-lightestGray duration-200 ease-in",
    default: "bg-lightestGray hover:bg-lightGray duration-200 ease-in",
    cta: "bg-white hover:bg-black hover:text-white border-2 border-black duration-200 ease-in",
  };
  const sizes = {
    compact: "p-1 rounded",
    default: "px-2 py-1 rounded-md",
    large: "px-4 py-2 rounded-lg",
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={joinTailwindClasses([variants[variant], sizes[size], css])}
    >
      {children}
    </button>
  );
}
