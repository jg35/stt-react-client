import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { debounce } from "lodash";
import colors from "~/lib/colors";
import { renderFragmentDate } from "~/lib/util";
import PhotoFragment from "~/components/edit/photoFragment";
import FragmentHeaderMenu from "~/components/timeline/fragmentHeaderMenu";

export default function EditableFragment({ fragment, saveFragment }) {
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
      {fragment.type === "PHOTO" ? (
        <PhotoFragment fragment={fragment} />
      ) : (
        <ContentEditable
          spellCheck={false}
          data-placeholder={
            fragment.type === "CHAPTER"
              ? "Enter chapter name"
              : "This memory is empty. Consider deleting it if you don't need it"
          }
          className="content-editable preview-element"
          html={text.current}
          onKeyPress={handleKeypress}
          onBlur={handleBlur}
          onChange={handleChange}
          tagName={fragment.type === "CHAPTER" ? "h1" : "p"}
        />
      )}
    </div>
  );
}
