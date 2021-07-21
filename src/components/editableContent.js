import ContentEditable from "react-contenteditable";
import { useRef } from "react";

export default function EditableContent({
  fieldValue,
  fieldTag,
  update,
  css = "",
  placeholder = "",
  style = {},
}) {
  let value = useRef(fieldValue);

  const handleChange = (evt) => {
    // Clear line breaks on change
    if (evt.target.value === "<div><br></div>" || evt.target.value === "<br>") {
      value.current = "";
    } else {
      value.current = evt.target.value;
    }
  };

  const handleBlur = () => {
    // Remove line breaks on save
    update(
      value.current.replace(/<div.*?>/g, "\n").replace(/<\/div>|<br>/g, "")
    );
  };

  const handleKeypress = (e) => {
    // Prevent line breaks
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <ContentEditable
      style={style}
      spellCheck={false}
      data-placeholder={placeholder}
      className={`content-editable ${css}`}
      html={value.current}
      onKeyPress={handleKeypress}
      onBlur={handleBlur}
      onChange={handleChange}
      tagName={fieldTag}
    />
  );
}
