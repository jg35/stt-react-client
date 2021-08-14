import { joinTailwindClasses } from "~/lib/util";

export default function Surface({ children, id, css = "" }) {
  return (
    <div
      id={id}
      className={joinTailwindClasses(["bg-offWhite px-4 h-screen", css])}
    >
      {children}
    </div>
  );
}
