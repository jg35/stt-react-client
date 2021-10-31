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

  let infoPosition;
  switch (fragment.type) {
    case "PHOTO":
      infoPosition = "-top-8";
      break;
    case "TEXT":
      infoPosition = "-top-8";
      break;
    case "CHAPTER":
      infoPosition = "-top-8";
      break;
  }

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
        style={{
          height: "calc(100% + 8px)",
          zIndex: -1,
        }}
        className={`${
          showInfo ? "flex" : "hidden"
        } absolute -top-4 -left-3 h-full border-l border-t border-lightGray w-full rounded-l`}
      ></div>
      <div
        className={`${
          showInfo ? "flex" : "hidden"
        } edit-fragment-info absolute animate-fade-in max-w-full min-w-full justify-between items-center h-8 z-20 ${infoPosition}`}
      >
        <div className="text-gray truncate bg-white px-2 md:px-4 mr-2 md:mr-4">
          {fragment.question ? fragment.question.title : ""}
        </div>
        <div className="flex items-center bg-white pl-2 ml-2 md:ml-4 whitespace-nowrap">
          <Text size="compact" tag="span" css="mr-2 text-gray">
            {renderFragmentDate(fragment.date)}
          </Text>
          <FragmentHeaderMenu
            fragment={fragment}
            excludeActions={["CHANGE_VISIBILITY"]}
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
