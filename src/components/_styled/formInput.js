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
  const baseCss = `outline-none bg-lightestGray rounded w-full border border-transparent transition duration-200 ease-in ${
    error && "border-red"
  }`;

  const variants = {
    default: "",
  };

  const sizes = {
    compact: " py-1.5 px-2 text-base",
    default: "p-3 text-xl",
    large: "",
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
