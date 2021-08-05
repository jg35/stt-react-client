export default function EditPreviewContainer({ children }) {
  return (
    <div
      className="pb-4 h-full max-h-full w-full mr-4"
      style={{ width: "75vh", maxWidth: "960px" }}
    >
      <div
        id="preview-container"
        className="h-full relative"
        style={{ width: "calc(100% - 24px)" }}
      >
        <div
          className={`absolute left-0 top-0 shadow-lg rounded-lg bg-white h-full w-full py-10 z-20 relative px-6`}
        >
          {children}
        </div>
        <div className="top-0 shadow-lg rounded-lg bg-white h-full w-full p-10 absolute left-3 z-10"></div>
        <div className="top-0 shadow-xl rounded-lg bg-white h-full w-full p-10 absolute left-6"></div>
      </div>
    </div>
  );
}
