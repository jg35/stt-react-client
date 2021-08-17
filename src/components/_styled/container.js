import { joinTailwindClasses } from "~/lib/util";

export default function Container({
  maxWidth = "1400px",
  children,
  css = "",
  style = {},
  id,
  background = null,
}) {
  const baseCss = "mx-auto w-full";

  const container = (
    <div
      id={id}
      className={joinTailwindClasses([baseCss, css])}
      style={{
        ...style,
        maxWidth,
        height: "100vh",
        height: "calc(var(--vh, 1vh) * 100)",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );

  if (!background) {
    return container;
  }
  return <div style={background}>{container}</div>;
}
