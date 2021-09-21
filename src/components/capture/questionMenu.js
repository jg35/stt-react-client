import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";

export default function QuestionMenu({ hideQuestion }) {
  const items = [
    {
      component: (
        <span className="flex justify-end w-full whitespace-nowrap px-1">
          Don't ask this question again
          <Svg name="cancel" css="ml-2" size={18} />
        </span>
      ),
      onClick: hideQuestion,
    },
  ];

  return (
    <Menu
      autoClose={false}
      toggle={<Svg name="overflow" color="gray" size={24} />}
      items={items}
    />
  );
}
