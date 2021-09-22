import ContentEditable from "react-contenteditable";
import { useRef, useState } from "react";
import { debounce } from "lodash";
import colors from "~/lib/colors";
import { renderFragmentDate } from "~/lib/util";
import PhotoFragment from "~/components/edit/photoFragment";
import FragmentHeaderMenu from "~/components/timeline/fragmentHeaderMenu";
import { Text } from "~/components/_styled";

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
      data-preview-fragment-type={fragment.type}
    >
      <div
        className={`${
          showInfo ? "flex" : "hidden"
        } edit-fragment-info absolute -top-10 h-10 animate-fade-in min-w-full justify-between items-center z-20`}
      >
        <div className="text-gray"></div>
        <div className="flex items-center">
          <Text size="compact" tag="span" css="mr-2 text-gray">
            {renderFragmentDate(fragment.date)}
          </Text>
          <FragmentHeaderMenu
            fragment={fragment}
            excludeActions={["CHANGE_VISIBILITY"]}
            menuColor="gray"
          />
        </div>
      </div>

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
