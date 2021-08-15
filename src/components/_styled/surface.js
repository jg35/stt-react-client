import { joinTailwindClasses } from "~/lib/util";

export default function Surface({ children, id, css = "" }) {
  return (
    <div
      id={id}
      className={joinTailwindClasses(["px-2 pb-2 h-full w-full", css])}
    >
      {children}
    </div>
  );
}
