export default function Toggle({
  val,
  actionTitle,
  onChange,
  css,
  id = "toggle",
}) {
  return (
    <div
      className={`relative inline-block w-10 align-middle select-none ${css}`}
    >
      <input
        type="checkbox"
        title={actionTitle}
        onChange={onChange}
        checked={val}
        name={id}
        id={id}
        className="toggle-checkbox absolute block w-6 h-6 border-2 border-red rounded-full bg-white appearance-none cursor-pointer transition-all duration-500 linear"
      />
      <label
        for={id}
        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer transition-all duration-500 linear"
      ></label>
    </div>
  );
}
