export default function Modal({ size, isOpen, children, close }) {
  let sizeCss;
  switch (size) {
    case "sm":
      sizeCss = "h-auto w-auto max-w-md";
      break;
    case "lg":
      sizeCss = "h-4/6 w-4/5 max-w-5xl";
      break;
    case "full":
      sizeCss = "h-full max-h-full w-full max-w-full";
      break;
    case "md":
    default:
      sizeCss = "h-auto w-2/5 max-w-2xl";
      break;
  }
  if (isOpen) {
    return (
      <div
        className="animate-fade-in absolute w-full h-full bg-lightestGray left-0 top-0 z-50 bg-opacity-90 flex justify-center items-center"
        onClick={close}
      >
        <div className="relative w-full h-full p-4">
          <div
            id="capture-form-wrapper"
            onClick={(e) => e.stopPropagation()}
            className={`animate-fade-in shadow-lg rounded-lg bg-white flex justify-center flex-col ${sizeCss} overflow-scroll`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
  return null;
}
