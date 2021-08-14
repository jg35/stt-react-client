import { joinTailwindClasses } from "~/lib/util";

export default function ButtonGroup({ id, children: buttons, css = "" }) {
  return (
    <div id={id} className={joinTailwindClasses(["flex min-h-full", css])}>
      {buttons.map((button, i) => {
        return (
          <div className="mx-2 flex-1" key={i}>
            {button}
          </div>
        );
      })}
    </div>
  );
}
