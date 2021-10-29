import colors from "~/lib/colors";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function ProgressRing({
  progress,
  text,
  size = "36",
  styles = {
    trailColor: colors.gray,
    pathColor: progress == 100 ? colors.green : colors.white,
    textColor: progress === 100 ? colors.green : colors.white,
    textSize: "32px",
    strokeLinecap: "round",
  },
}) {
  return (
    <div
      style={{ minWidth: `${size}px`, width: `${size}px`, height: `${size}px` }}
    >
      <CircularProgressbar
        value={progress}
        text={`${text}`}
        styles={buildStyles({
          ...styles,
        })}
      />
    </div>
  );
}
