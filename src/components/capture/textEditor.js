export default function TextEditor({
  name,
  handleBlur,
  handleChange,
  value,
  onKeyUp,
  error,
  autoFocus = true,
  height = "h-44 md:h-60",
  placeholder = "",
}) {
  return (
    <div className="flex-1 relative">
      <textarea
        id="form-text-editor"
        name={name}
        onKeyUp={(e) => {
          onKeyUp(e);
        }}
        autoFocus={autoFocus}
        onFocus={function (e) {
          // TODO - wtf is this crazy shit.
          var val = e.target.value;
          e.target.value = "";
          e.target.value = val;
        }}
        placeholder={placeholder}
        className={`focus:outline-none bg-white border-lightGray transition duration-200 ease-in resize-none py-3 px-4 text-lg ${
          error ? "input-error border" : "focus:bg-offWhite"
        } w-full ${height}`}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      />
    </div>
  );
}
