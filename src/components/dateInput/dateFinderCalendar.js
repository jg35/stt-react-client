import { useState } from "react";

import Svg from "~/components/svg";
import { joinTailwindClasses } from "~/lib/util";
import { Grid } from "~/components/_styled";

function ContentIndicator({ type, i, show }) {
  let baseCss = ["h-3", "w-3", "rounded-full", "absolute", "left-0", "shadow"];
  switch (type) {
    case "WORLD_EVENT":
      baseCss.push("bg-gold");
      break;
    case "USER_EVENT":
      baseCss.push("bg-blue");
      break;
    case "FRAGMENT":
      baseCss.push("bg-gray");
      break;
  }
  if (!show) {
    baseCss.push("hidden");
  }
  return (
    <div
      className={baseCss.join(" ")}
      style={{
        left: "-7px",
        top: `${i * 8}px`,
        zIndex: i * 10,
      }}
    ></div>
  );
}

function Date({ date, expand, currentDate, onChange }) {
  const [hover, setHover] = useState(false);

  const canExpand =
    date.worldEvents.length || date.userEvents.length || date.fragments.length;

  let baseCss = [
    "shadow",
    "hover:text-white",
    "hover:shadow",
    date.date === currentDate ? "bg-offBlack" : "bg-lightGray",
    date.date === currentDate ? "text-white" : "text-offBlack",
    date.date === currentDate ? "hover:bg-offBlack" : "hover:bg-darkGray",
    "h-7",
    "w-7",
    "my-.5",
    "rounded-full",
    "cursor-pointer",
    "mx-auto",
    "flex",
    "justify-center",
    "items-center",
    "duration-200",
    "ease-in",
    "transition",
    "relative",
  ].join(" ");

  return (
    <div
      className={joinTailwindClasses([baseCss])}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (date.date) {
          if (canExpand) {
            expand(date);
          } else {
            onChange(date.date);
          }
        }
      }}
    >
      <div className="absolute top-1 left-0">
        <ContentIndicator
          type="USER_EVENT"
          show={date.userEvents.length}
          i={0}
        />
        <ContentIndicator
          type="WORLD_EVENT"
          show={date.worldEvents.length}
          i={1}
        />
        <ContentIndicator type="FRAGMENT" show={date.fragments.length} i={2} />
      </div>
      {canExpand && hover ? (
        <Svg name="search" size={10} color="white" />
      ) : (
        date.title
      )}
    </div>
  );
}

export default function DateFinderCalendar({
  monthItems,
  currentDate,
  onChange,
  setExpanded,
}) {
  function Day({ day }) {
    return <div className="text-center font-medium">{day}</div>;
  }

  return (
    <div className="relative">
      <div className="py-4">
        <Grid gridCols="grid-cols-14" colSpan={["col-span-2"]}>
          <Day day="Mon" />
          <Day day="Tue" />
          <Day day="Wed" />
          <Day day="Thu" />
          <Day day="Fri" />
          <Day day="Sat" />
          <Day day="Sun" />
        </Grid>
        <Grid gridCols="grid-cols-14" colSpan={["col-span-2"]}>
          {monthItems.map((d, i) => {
            if (!d.date) {
              return <div className="h-8 w-8"></div>;
            }
            return (
              <Date
                key={i}
                date={d}
                expand={setExpanded}
                currentDate={currentDate}
                onChange={onChange}
              />
            );
          })}
        </Grid>
      </div>
    </div>
  );
}
