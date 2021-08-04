import { overrideTailwindClasses } from "tailwind-override";

export default function TabLink({
  activeTab,
  setActiveTab,
  title,
  tab,
  description,
}) {
  const variants = {
    base: "mb-4 font-medium flex flex-col cursor-pointer rounded border-2 p-3 duration-200 transition-all	",
    default: "hover:bg-lightestGray border-transparent",
    active: "border-black",
  };

  return (
    <div
      className={`${variants.base} ${
        activeTab === tab ? variants.active : variants.default
      }`}
      onClick={() => {
        setActiveTab(tab);
        window.location.hash = `#${tab.toLowerCase()}`;
      }}
    >
      <span>{title}</span>
      {description && (
        <span className="font-normal text-sm text-gray">{description}</span>
      )}
    </div>
  );
}
