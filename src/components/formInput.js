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
      value={value}
    />
  );
}
