export default function EditPreviewContainer({ children }) {
  return (
    <div
      className="h-full max-h-full w-full mx-auto"
      style={{ maxWidth: "768px" }}
    >
      <div id="preview-container" className="h-full relative">
        <div
          className={`absolute left-0 top-0 shadow-lg rounded-lg bg-white h-full w-full py-10 z-20 relative px-2 md:px-6`}
        >
          {children}
        </div>
        <div className="hidden md:block">
          <div className="top-0 shadow-lg rounded-lg bg-white h-full w-full p-10 absolute left-3 z-10"></div>
          <div className="top-0 shadow-xl rounded-lg bg-white h-full w-full p-10 absolute left-6"></div>
        </div>
      </div>
    </div>
  );
}
