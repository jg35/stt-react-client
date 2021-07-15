import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { debounce } from "lodash";
import colors from "~/lib/colors";
import { renderFragmentDate } from "~/lib/util";
import FragmentHeaderMenu from "~/components/timeline/fragmentHeaderMenu";

export default function EditableFragment({ fragment, saveFragment, theme }) {
  const [showInfo, setShowInfo] = useState(false);
  let text = useRef(fragment.content);

  const handleChange = (evt) => {
    text.current = evt.target.value;
  };

  const handleBlur = () => {
    saveFragment(text.current);
  };

  let textClass = `mb-8 whitespace-pre-wrap focus:outline-none ${theme.fontSize} ${theme.lineHeight} ${theme.fontFamily}`;
  let chapterClass = `text-center my-20 focus:outline-none ${theme.chapterFontSize} ${theme.lineHeight} ${theme.fontFamily}`;

  return (
    <div
      onMouseEnter={() => setShowInfo(true)}
      onMouseOver={debounce(() => setShowInfo(true), 200)}
      onMouseLeave={debounce(() => setShowInfo(false), 200)}
      className="relative"
      data-preview-fragment-id={fragment.id}
    >
      {showInfo && (
        <div className="absolute -top-8 h-8 animate-fade-in min-w-full flex justify-between items-center">
          <div className="text-gray ">{fragment.title || ""}</div>
          <div className="flex items-center">
            <span className="mr-2 text-gray ">
              {renderFragmentDate(fragment.date)}
            </span>
            <FragmentHeaderMenu
              fragment={fragment}
              excludeActions={["CHANGE_VISIBILITY"]}
              menuColor={colors.gray}
            />
          </div>
        </div>
      )}
      <div>
        <ContentEditable
          spellCheck={false}
          className={fragment.type === "CHAPTER" ? chapterClass : textClass}
          html={text.current}
          onBlur={handleBlur}
          onChange={handleChange}
          tagName={fragment.type === "CHAPTER" ? "h1" : "p"}
        />
      </div>
    </div>
  );
}
