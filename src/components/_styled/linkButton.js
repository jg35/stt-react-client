import { joinTailwindClasses } from "~/lib/util";

export default function LinkButton({
  id,
  css = "",
  size = "default",
  variant = "default",
  href = null,
  style = {},
  children: text,
  external = false,
}) {
  const baseCss = `flex justify-center items-center rounded border-2 duration-200 ease-in w-full`;
  const variants = {
    minimal: `bg-transparent hover:bg-lightestGray border-transparent hover:border-lightestGray`,
    default: `bg-lightestGray border-lightestGray`,
    secondary: `bg-white font-medium border-offBlack hover:bg-offBlack hover:text-white hover:shadow-md`,
    cta: `bg-offBlack text-white font-medium border-offBlack hover:bg-black hover:border-black hover:shadow-md`,
  };
  const sizes = {
    compact: "p-1.5 px-2 text-base",
    default: "p-3 text-lg ",
    large: "p-4 text-xl",
  };

  return (
    <a
      id={id}
      rel="noreferrer"
      target={external ? "_blank" : "_self"}
      href={href}
      style={style}
      className={joinTailwindClasses([
        baseCss,
        variants[variant],
        sizes[size],
        css,
      ])}
    >
      {text}
    </a>
  );
}
