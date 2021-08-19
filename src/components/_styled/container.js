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
  return (
    <div>
      <div
        style={{
          ...{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          },
          ...background,
        }}
      />
      {container}
    </div>
  );
}
