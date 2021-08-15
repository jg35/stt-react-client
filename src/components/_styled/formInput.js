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
}) {
  const baseCss = `outline-none bg-offWhite border-transparent border-2 rounded w-full transition duration-200 ease-in ${
    error && "border-red"
  }`;

  const variants = {
    default: "",
  };

  const sizes = {
    compact: " py-1.5 px-2 text-base",
    default: "p-3 text-lg",
    large: "text-xl",
  };

  return (
    <input
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
