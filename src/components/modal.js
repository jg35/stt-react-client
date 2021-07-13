export default function Modal({ size, isOpen, children, close }) {
  let sizeCss;
  switch (size) {
    case "sm":
      sizeCss = "h-auto w-auto max-w-md";
      break;
    case "lg":
      sizeCss = "h-4/6 w-4/5 max-w-5xl";
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
        <div
          id="capture-form-wrapper"
          onClick={(e) => e.stopPropagation()}
          className={`animate-fade-in m-1 shadow-lg rounded-lg bg-white p-4 flex justify-center flex-col pt-10 pl-10 pr-6 ${sizeCss}`}
        >
          {children}
        </div>
      </div>
    );
  }
  return null;
}
