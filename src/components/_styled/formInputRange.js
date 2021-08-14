export default function FormInputRange({
  handleChange,
  value,
  step,
  min,
  max,
}) {
  return (
    <input
      type="range"
      className="flex-1"
      value={value}
      step={step}
      min={min}
      max={max}
      onChange={handleChange}
    />
  );
}
