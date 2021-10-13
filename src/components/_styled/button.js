import { joinTailwindClasses } from "~/lib/util";
import InProgress from "./inProgress";

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
    disabled ? "cursor-default opacity-80" : "cursor-pointer"
  }`;
  const variants = {
    nothing: `bg-transparent border-transparent`,
    minimal: `bg-transparent hover:bg-lightestGray border-transparent hover:border-lightestGray`,
    default: `bg-lightestGray border-lightestGray ${
      !disabled && "hover:border-lightGray hover:shadow-sm hover:bg-lightGray "
    }`,
    secondary: `bg-white font-medium border-offBlack ${
      !disabled
        ? "hover:bg-offBlack hover:text-white hover:shadow-md"
        : "opacity-50"
    }`,
    privacyStatus: `bg-white font-medium border-offBlack rounded-lg mr-6 ease-in duration-400 h-full flex-col items-center font-normal`,
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
