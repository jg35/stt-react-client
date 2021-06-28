import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { DateTime } from "luxon";

export default function ScrollNavigator({ years, dob }) {
  const [hoverYear, setHoverYear] = useState(null);
  const [visibleYears, setVisibleYears] = useState([]);
  const [hightlightN, setHightlightN] = useState(5);

  useEffect(() => {
    const minYearHeight = 44;
    const containerHeight = window.innerHeight - 208;
    // // accomadate for showing first and last year (2)
    const displayYears = Math.floor(containerHeight / minYearHeight) - 2;
    const age = new Date().getFullYear() - DateTime.fromISO(dob).year;
    setHightlightN(5);
    const nYears = Math.floor(age / displayYears);
    const sliceYears = [...years];
    const firstYear = sliceYears.shift();
    const lastYear = sliceYears.pop();

    setVisibleYears([
      firstYear,
      ...sliceYears.filter((year, i) => i % nYears === 0),
      lastYear,
    ]);
  }, [years]);

  function YearWrap({ year, children }) {
    return (
      <div
        className="flex-1 min-w-full flex items-center justify-center z-10"
        onMouseEnter={() => setHoverYear(year)}
        onMouseLeave={() => setHoverYear(null)}
      >
        {children}
      </div>
    );
  }

  function scrollToYear(year) {
    const match = document.querySelector(`section[data-season-year="${year}"]`);
    if (match) {
      match.scrollIntoView({ behavior: "smooth" });
    }
  }

  function TimelineMarker() {
    return (
      <div
        className="absolute top-0 left-1/2 border border-lightGray h-full w-px"
        style={{
          transform: "translateX(-50%)",
        }}
      ></div>
    );
  }
  return (
    <div className="relative flex flex-col justify-between items-center w-full h-full py-3">
      <TimelineMarker />
      {visibleYears.map((year, index) => {
        if (hoverYear && hoverYear === year.year) {
          return (
            <YearWrap key={index}>
              <div
                className="bg-white font-medium cursor-pointer text-center border-b-2 py-1/2 px-1 border-black animate-expand"
                onClick={() => scrollToYear(year.year)}
              >
                {year.year}
              </div>
            </YearWrap>
          );
        } else if (
          // First, last, divisible by 5 or containing fragments
          index === 0 ||
          index === visibleYears.length - 1 ||
          year.year % hightlightN === 0
        ) {
          return (
            <YearWrap year={year.year} key={index}>
              <div
                className={`bg-white text-center ${
                  year.fragments && "font-medium"
                }`}
              >
                {year.year}
              </div>
            </YearWrap>
          );
        } else {
          return (
            <YearWrap year={year.year} key={index}>
              <span
                className={`w-1.5 h-1.5 rounded ${
                  year.fragments ? "bg-black" : "bg-gray"
                }`}
              ></span>
            </YearWrap>
          );
        }
      })}
    </div>
  );
}
