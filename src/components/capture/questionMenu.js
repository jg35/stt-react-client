import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";

export default function QuestionMenu({
  hideQuestion,
  hideTag,
  currentTag = null,
}) {
  const items = [
    {
      component: (
        <span className="flex justify-end w-full whitespace-nowrap px-1">
          Don't show this question again
          {/* <Svg name="cancel" css="ml-1" size={18} /> */}
        </span>
      ),
      onClick: hideQuestion,
    },
  ];

  if (currentTag !== null) {
    items.push({
      component: (
        <span className="flex justify-end w-full whitespace-nowrap px-1">
          Hide questions with tag: <strong>&nbsp;{currentTag}</strong>
          {/* <Svg name="cancel" css="ml-1" size={18} /> */}
        </span>
      ),
      onClick: hideTag,
    });
  }

  return (
    <Menu
      autoClose={false}
      toggle={<Svg name="overflow" color="gray" size={24} />}
      items={items}
    />
  );
}
