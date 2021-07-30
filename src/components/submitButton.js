import React from "react";

export default function SubmitButton({
  isSubmitting,
  bigCta = false,
  children,
  style = {},
  disabled = false,
  width = "w-36",
}) {
  let stateCss = width;
  if (isSubmitting || bigCta) {
    stateCss = stateCss + " bg-black text-white border-2 border-black ";
  } else {
    stateCss = stateCss + " bg-white border-2 border-black ";
  }
  if (disabled) {
    stateCss = stateCss + " opacity-50 cursor-not-allowed hover:bg-white";
  } else {
    stateCss = stateCss + " hover:bg-black hover:text-white";
  }
  return (
    <button
      disabled={disabled}
      style={style}
      id="form-submit-btn"
      type="submit"
      className={`flex font-medium items-center rounded p-2 justify-center text-lg duration-200 ease-in ${stateCss}`}
    >
      {isSubmitting && (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
}
