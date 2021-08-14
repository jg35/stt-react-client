import { joinTailwindClasses } from "~/lib/util";

export default function FormLabel({
  id,
  children: label,
  css = "",
  style = {},
  variant = "default",
}) {
  const baseCss = "";
  const variants = {
    default: "text-gray",
  };
  return (
    <label
      id={id}
      style={style}
      className={joinTailwindClasses([baseCss, variants[variant], css])}
    >
      {label}
    </label>
  );
}
