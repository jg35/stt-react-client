import { joinTailwindClasses } from "~/lib/util";
export default function Container({
  children,
  css = "",
  style = {},
  id,
  background = null,
  overflow = "hidden",
}) {
  const baseCss = "mx-auto w-full";

  const container = (
    <div
      id={id}
      className={joinTailwindClasses([baseCss, css])}
      style={{
        ...style,

        height: "100vh",
        height: "calc(var(--vh, 1vh) * 100)",
        overflow,
      }}
    >
      {children}
    </div>
  );

  if (!background) {
    return container;
  }
  return (
    <div
      style={{
        backgroundColor: background.color,
        border: background.border,
      }}
    >
      {container}
    </div>
  );
}
