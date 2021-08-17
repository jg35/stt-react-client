import { joinTailwindClasses } from "~/lib/util";

export default function Surface({ children, id, css = "" }) {
  return (
    <div
      id={id}
      className={joinTailwindClasses([
        "max-h-full h-full w-full flex flex-col",
        css,
      ])}
    >
      {children}
    </div>
  );
}
