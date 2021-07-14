import ContentEditable from "react-contenteditable";
import { useRef } from "react";

export default function EditableFragment({ fragment, saveFragment, theme }) {
  let text = useRef(fragment.content);

  const handleChange = (evt) => {
    text.current = evt.target.value;
  };

  const handleBlur = () => {
    saveFragment(text.current);
  };

  let textClass = "mb-4 whitespace-pre-wrap focus:outline-none";
  let chapterClass = "text-center my-20 focus:outline-none";

  let chapterFontSize = theme.chapters.fontSize;
  switch (chapterFontSize) {
    case "sm":
      chapterClass += " text-2xl";
      break;
    case "md":
      chapterClass += " text-4xl";
      break;
    case "lg":
      chapterClass += " text-6xl";
      break;
  }

  let bodyFontSize = theme.text.fontSize;
  switch (bodyFontSize) {
    case "sm":
      textClass += " text-sm";
      break;
    case "md":
      textClass += " text-base";
      break;
    case "lg":
      textClass += " text-lg";
      break;
  }

  return (
    <ContentEditable
      spellCheck={false}
      className={fragment.type === "CHAPTER" ? chapterClass : textClass}
      html={text.current}
      onBlur={handleBlur}
      onChange={handleChange}
      tagName={fragment.type === "CHAPTER" ? "h1" : "p"}
    />
  );
}
