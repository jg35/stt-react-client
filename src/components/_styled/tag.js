import { joinTailwindClasses } from "~/lib/util";

export default function Tag({ children: tag, css = "", interactive = false }) {
  let baseCss =
    "uppercase text-darkGray font-bold px-2 py-1 text-sm bg-lightestGray rounded-md flex items-center justify-center whitespace-nowrap mr-2";

  if (interactive) {
    baseCss +=
      " hover:bg-lightGray hover:text-offBlack duration-200 ease-in transition";
  }
  return <span className={joinTailwindClasses([baseCss, css])}>{tag}</span>;
}
