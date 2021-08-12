export default function FormInput({
  handleChange,
  handleBlur,
  value,
  error,
  placeholder,
  name,
  compact = false,
  autoFocus = true,
  type = "text",
  onKeyUp = null,
}) {
  return (
    <input
      id="form-text-input"
      name={name}
      className={`input ${compact ? "input--compact" : ""} ${
        error && "input-error"
      }`}
      autoFocus={autoFocus}
      placeholder={placeholder}
      type={type}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyUp={onKeyUp}
      value={value}
    />
  );
}
