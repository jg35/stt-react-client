import { joinTailwindClasses } from "~/lib/util";

export default function Card({
  children,
  style = {},
  css = "",
  variant = "default",
  size = "default",
}) {
  const styles = {
    variants: {
      default: "bg-white flex flex-col shadow-lg rounded-lg",
    },
    sizes: {
      default: "p-4",
    },
  };
  return (
    <div
      className={joinTailwindClasses([
        styles.variants[variant],
        styles.sizes[size],
        css,
      ])}
      style={style}
    >
      {children}
    </div>
  );
}
