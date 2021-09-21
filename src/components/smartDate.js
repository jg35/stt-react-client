import Color from "color";
import Svg from "~/components/svg";
import colors from "~/lib/colors";
import { getTranslationString } from "~/lib/util";
export default function SmartDate({ reason, confidence }) {
  const green = Color(`#3fff00`);
  const yellow = Color("yellow");
  const confidenceColor = green.mix(yellow, (100 - confidence) / 10).hex();

  return (
    <span
      className="flex items-center justify-center rounded p-1 shadow-md bg-white cursor-pointer text-sm uppercase text-offBlack mb-2 font-bold"
      title={`${confidence}% confidence in this date. ${getTranslationString(
        `components.smartDate.tooltip.${reason}`
      )}`}
    >
      <Svg
        name="check"
        color={colors.green}
        height={16}
        width={16}
        css="mr-1"
      />
      <span>
        Smart Date&nbsp;
        <span>({confidence}%)</span>
      </span>
    </span>
  );
}
