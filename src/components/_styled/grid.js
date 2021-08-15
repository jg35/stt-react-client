import { joinTailwindClasses } from "~/lib/util";

export default function Grid({
  colSpan = ["col-span-12"],
  gridCols = "grid-cols-12",
  height = "h-auto",
  gap = "gap-x-4 gap-y-4",
  autoRows = "auto-rows-auto",
  css = "",
  children: columns,
}) {
  let renderCols = Array.isArray(columns) ? columns : [columns];
  renderCols = renderCols.filter((c) => !!c);

  const baseCss = `grid ${autoRows} ${gridCols} ${gap} ${height}`;

  return (
    <div className={joinTailwindClasses([baseCss, css])}>
      {[...renderCols].map((column, i) => {
        const colClass = `${colSpan[i] || colSpan[colSpan.length - 1]}`;
        return (
          <div key={i} className={colClass}>
            {column}
          </div>
        );
      })}
    </div>
  );
}
