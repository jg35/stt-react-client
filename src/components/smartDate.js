import Color from "color";
import Svg from "~/components/svg";
import colors from "~/lib/colors";
import { getTranslationString } from "~/lib/util";
export default function SmartDate({ reason }) {
  const green = Color(`#3fff00`);
  const yellow = Color("yellow");
  const confidenceColor = green
    .mix(yellow, (100 - reason.confidence) / 10)
    .hex();

  return (
    <span
      className="flex items-center justify-center rounded p-1 shadow-md bg-white cursor-pointer text-sm uppercase text-offBlack mb-2 font-bold"
      title={`${
        reason.confidence
      }% confidence in this date. ${getTranslationString(
        `components.smartDate.tooltip.${reason.reason}`
      )}`}
    >
      <Svg name="check" color="green" size={16} css="mr-1" />
      <span>
        Auto Date&nbsp;
        <span>({reason.confidence}%)</span>
      </span>
    </span>
  );
}
