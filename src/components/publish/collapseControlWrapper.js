import { joinTailwindClasses } from "~/lib/util";

export default function CollapseControlWrapper({
  isCollapsed = true,
  children: controls,
  css = "",
}) {
  const baseCss = [
    "-top-12",
    "absolute",
    "bg-white",
    "flex",
    "justify-center",
    "items-center",
    "left-2/4",
    "sm:w-auto",
    "mx-auto",
    "p-2",
    "rounded-b",
    "shadow",
    "w-11/12",
    "whitespace-nowrap",
    "z-50",
    isCollapsed ? "animate-slide-out" : "animate-slide-in",
  ].join(" ");

  return (
    <div
      style={{
        transform: "translateX(-50%)",
      }}
      className={joinTailwindClasses([baseCss, css])}
    >
      {controls}
    </div>
  );
}
