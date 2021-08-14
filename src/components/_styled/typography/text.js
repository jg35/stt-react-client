import { joinTailwindClasses } from "~/lib/util";

export default function Text({
  children: content,
  id,
  css = "",
  style = {},
  size = "default",
  tag = "p",
}) {
  console.log("content", content);
  const sizes = {
    compact: "",
    default: "mb-2",
    large: "text-lg mb-4",
    callout: "text-xl font-medium mb-6",
  };

  const props = {
    id,
    style,
    className: joinTailwindClasses([sizes[size], css]),
  };

  switch (tag) {
    case "span":
      return <span {...props}>{content}</span>;
    case "p":
    default:
      return <p {...props}>{content}</p>;
  }
}
