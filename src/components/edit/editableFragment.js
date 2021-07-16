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
    if (evt.target.value === "<div><br></div>" || evt.target.value === "<br>") {
      text.current = "";
    } else {
      text.current = evt.target.value;
    }
  };

  const handleBlur = () => {
    saveFragment(
      text.current.replace(/<div.*?>/g, "\n").replace(/<\/div>|<br>/g, "")
    );
  };

  const handleKeypress = (e) => {
    // Prevent empty space in chapters
    if (fragment.type === "CHAPTER" && e.key === "Enter") {
      e.preventDefault();
    }
  };

  let textClass = `whitespace-pre-wrap focus:outline-none ${theme.fontSize} ${theme.lineHeight} ${theme.fontFamily}`;
  let chapterClass = `text-center focus:outline-none ${theme.chapterFontSize} ${theme.lineHeight} ${theme.fontFamily}`;

  return (
    <div
      onMouseEnter={() => setShowInfo(true)}
      onMouseOver={debounce(() => setShowInfo(true), 200)}
      onMouseLeave={debounce(() => setShowInfo(false), 200)}
      className="relative"
      data-preview-fragment-id={fragment.id}
    >
      {showInfo && (
        <div className="edit-fragment-info absolute -top-8 h-8 animate-fade-in min-w-full flex justify-between items-center z-20">
          <div className="text-gray">{fragment.title || ""}</div>
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
          style={{
            marginTop: fragment.type === "CHAPTER" ? "2em" : "0",
            marginBottom: "2em",
          }}
          spellCheck={false}
          data-placeholder={
            fragment.type === "CHAPTER"
              ? "Enter chapter name"
              : "This memory is empty. Consider deleting it if you don't need it"
          }
          className={`content-editable ${
            fragment.type === "CHAPTER" ? chapterClass : textClass
          }`}
          html={text.current}
          onKeyPress={handleKeypress}
          onBlur={handleBlur}
          onChange={handleChange}
          tagName={fragment.type === "CHAPTER" ? "h1" : "p"}
        />
      </div>
    </div>
  );
}
