import { joinTailwindClasses } from "~/lib/util";
import Svg from "~/components/svg";

export default function Tag({ children: tag, css = "", interactive = false }) {
  let baseCss =
    "text-darkGray px-2 py-1 text-sm bg-lightestGray rounded-md flex items-center justify-center whitespace-nowrap mr-2";

  if (interactive) {
    baseCss +=
      " cursor-pointer hover:bg-lightGray hover:text-offBlack duration-200 ease-in transition";
  }
  return (
    <span className={joinTailwindClasses([baseCss, css])}>
      {tag}
      {interactive && (
        <Svg name="cancel" hoverColor="offBlack" color="darkGray" size={12} />
      )}
    </span>
  );
}
