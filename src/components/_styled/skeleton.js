import { joinTailwindClasses } from "~/lib/util";

export default function Skeleton({
  repeat = 5,
  height = "h-4",
  width = "w-full",
  spacing = "my-2",
  wrapSpacing = "py-2",
  css = "",
}) {
  const baseCss = `mb-3 h-4 bg-lightestGray rounded animate-pulse ${height} ${width} ${spacing}`;
  return (
    <div className={wrapSpacing}>
      {[...new Array(repeat)].map((i) => (
        <div key={i} className={joinTailwindClasses([baseCss, css])}></div>
      ))}
    </div>
  );
}
