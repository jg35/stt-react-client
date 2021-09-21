import Menu from "~/components/menu";
import Svg from "~/components/svg";
import colors from "~/lib/colors";

export default function QuestionMenu({ hideQuestion }) {
  const items = [
    {
      component: (
        <span className="flex justify-end w-full whitespace-nowrap px-1">
          Don't ask this question again
          <Svg name="cancel" css="ml-2" width="18" height="18" />
        </span>
      ),
      onClick: hideQuestion,
    },
  ];

  return (
    <Menu
      autoClose={false}
      toggle={
        <Svg name="overflow" color={colors.gray} width="24" height="24" />
      }
      items={items}
    />
  );
}
