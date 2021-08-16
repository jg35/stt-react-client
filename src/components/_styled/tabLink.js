import { joinTailwindClasses } from "~/lib/util";
import Text from "./typography/text";

export default function TabLink({
  activeTab,
  setActiveTab,
  title,
  tab,
  description,
  css = "",
  style = {},
}) {
  const baseCss =
    "lg:mb-4 font-medium flex flex-col items-center lg:items-start cursor-pointer rounded border-2 p-1.5 lg:p-3 duration-200 transition-all w-full";
  const variants = {
    default: "hover:bg-lightestGray border-transparent",
    active: "border-black",
  };

  return (
    <button
      type="button"
      className={joinTailwindClasses([
        baseCss,
        variants[activeTab === tab ? "active" : "default"],
        css,
      ])}
      style={style}
      onClick={() => {
        setActiveTab(tab);
        window.location.hash = `#${tab.toLowerCase()}`;
      }}
    >
      <Text tag="span" css="mb-0">
        {title}
      </Text>
      {description && (
        <Text tag="span" css="hidden lg:inline text-sm text-left text-gray">
          {description}
        </Text>
      )}
    </button>
  );
}
