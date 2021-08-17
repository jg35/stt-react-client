export default function CollapseControlWrapper({
  isCollapsed = true,
  children: controls,
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
  ].join(" ");

  return (
    <div
      style={{
        transform: "translateX(-50%)",
      }}
      className={`${baseCss} ${
        isCollapsed ? "animate-slide-in" : "animate-slide-out"
      }`}
    >
      {controls}
    </div>
  );
}
