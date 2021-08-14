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
    "mb-4 font-medium flex flex-col cursor-pointer rounded border-2 p-3 duration-200 transition-all";
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
      <Text tag="span">{title}</Text>
      {description && (
        <Text tag="span" css="text-sm text-gray">
          {description}
        </Text>
      )}
    </button>
  );
}
