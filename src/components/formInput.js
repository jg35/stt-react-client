export default function FormInput({
  handleChange,
  handleBlur,
  value,
  error,
  placeholder,
  name,
  compact = false,
  autoFocus = true,
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
      type="text"
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
    />
  );
}
