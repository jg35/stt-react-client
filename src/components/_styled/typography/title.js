import { joinTailwindClasses } from "~/lib/util";

export default function Title({
  children: title,
  css,
  style = {},
  id,
  size = "default",
  variant = "default",
  tag = "h1",
}) {
  const variants = {
    default: "text-left",
  };
  const sizes = {
    compact: "text-md md:text-lg mb-2",
    default: "text-lg md:text-xl mb-6",
    large: "text-xl md:text-2xl mb-6",
    headline: "text-2xl md:text-4xl mb-6",
  };

  const props = {
    id: id,
    style: style,
    className: joinTailwindClasses([variants[variant], sizes[size], css]),
  };

  switch (tag) {
    case "h1":
      return <h1 {...props}>{title}</h1>;
    case "h2":
      return <h2 {...props}>{title}</h2>;
    case "h3":
      return <h3 {...props}>{title}</h3>;
    case "h4":
      return <h4 {...props}>{title}</h4>;
    case "h5":
      return <h5 {...props}>{title}</h5>;
    case "h6":
      return <h6 {...props}>{title}</h6>;
  }
}
