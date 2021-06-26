export default function FormInput({
  handleChange,
  handleBlur,
  value,
  error,
  placeholder,
  name,
}) {
  return (
    <input
      name={name}
      className={`input ${error && "input-error"}`}
      autoFocus
      placeholder={placeholder}
      type="text"
      onChange={handleChange}
      onBlur={handleBlur}
      value={value}
    />
  );
}
