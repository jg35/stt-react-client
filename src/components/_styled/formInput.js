import { joinTailwindClasses } from "~/lib/util";

export default function FormInput({
  id = "form-text-input",
  type = "text",
  name,
  variant = "default",
  size = "default",
  css = "",
  style = {},
  value,
  error = false,
  placeholder,
  autoFocus = false,
  handleChange,
  handleBlur,
  handleKeyUp = null,
  autoComplete = "off",
}) {
  const baseCss = `rounded-none outline-none w-full transition duration-200 ease-in`;

  const variants = {
    default: error
      ? "border-red border"
      : "border-b border-lightGray focus:border-gray focus:bg-offWhite",
    question: "",
  };

  const sizes = {
    compact: " py-1.5 px-2 text-base",
    default: "px-3 py-2 text-lg",
    large: "text-xl",
  };

  return (
    <input
      autoComplete={autoComplete}
      id={id}
      type={type}
      name={name}
      style={style}
      className={joinTailwindClasses([
        baseCss,
        variants[variant],
        sizes[size],
        css,
      ])}
      autoFocus={autoFocus}
      placeholder={placeholder}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      value={value}
    />
  );
}
