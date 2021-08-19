import { joinTailwindClasses } from "~/lib/util";

function InProgress({ inProgress }) {
  return (
    inProgress && (
      <svg
        className="animate-spin -ml-1 mr-3 h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <>
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
        </>
      </svg>
    )
  );
}

export default function Button({
  id,
  onClick,
  children,
  css = "",
  size = "default",
  variant = "default",
  type = "button",
  disabled = false,
  inProgress = false,
  style = {},
  title = "",
}) {
  const baseCss = `flex justify-center items-center rounded border-2 duration-200 ease-in w-full ${
    disabled ? "cursor-not-allowed opacity-80" : "cursor-pointer"
  }`;
  const variants = {
    minimal: `bg-transparent hover:bg-lightestGray border-transparent hover:border-lightestGray`,
    default: `bg-lightestGray border-lightestGray ${
      !disabled && "hover:border-lightGray hover:shadow-sm hover:bg-lightGray "
    }`,
    secondary: `bg-white font-medium border-offBlack ${
      !disabled
        ? "hover:bg-offBlack hover:text-white hover:shadow-md"
        : "opacity-50"
    }`,
    privacyStatus: `bg-white font-medium border-offBlack rounded-lg mr-6 ease-in duration-400 h-full flex-col items-center font-normal xl:h-48`,
    cta: `bg-offBlack text-white font-medium border-offBlack ${
      !disabled && "hover:bg-black hover:border-black hover:shadow-md"
    }`,
  };
  const sizes = {
    compact: "py-1 px-1.5 text-base",
    default: "py-1 px-3 md:py-2 text-lg",
    large: "p-4 text-xl",
  };

  return (
    <button
      id={id}
      title={title}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={joinTailwindClasses([
        baseCss,
        variants[variant],
        sizes[size],
        css,
      ])}
    >
      <InProgress inProgress={inProgress} />
      {children}
    </button>
  );
}
