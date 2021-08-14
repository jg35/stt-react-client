import { joinTailwindClasses } from "~/lib/util";

export default function FormCaption({
  id,
  children: text,
  css = "",
  style = {},
  variant = "info",
}) {
  const baseCss = "block h-8";
  const variants = {
    error: "text-red",
    info: "text-gray",
    success: "text-successGreen",
  };
  return (
    <p
      id={id}
      style={style}
      className={joinTailwindClasses([baseCss, variants[variant], css])}
    >
      {text}
    </p>
  );
}
