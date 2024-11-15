import React, { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { scrollToYear } from "~/lib/timeline";

function ScrollNavigator({ dob }) {
  const [hoverYear, setHoverYear] = useState(null);
  const [visibleYears, setVisibleYears] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      let nowYear = DateTime.fromISO(dob);
      const years = [];
      const now = DateTime.utc();
      while (nowYear.year <= now.year) {
        years.push(nowYear.year);
        nowYear = nowYear.plus({ years: 1 });
      }
      // Minimum of height of each year element
      const minYearHeight = 36;
      // Height of the parent
      const containerHeight = document.querySelector(
        ".js-timeline-scroll-container"
      ).clientHeight;
      // The maximum number of years we can show between first and last
      const displayYears = Math.floor(containerHeight / minYearHeight);
      const age = new Date().getFullYear() - DateTime.fromISO(dob).year;
      const displayYearInterval = age / displayYears;
      const firstYear = years[0];
      const lastYear = years[years.length - 1];
      let currentYear = firstYear + displayYearInterval;
      const filteredYears = years.filter((year) => {
        if (Math.round(currentYear) === year && year < lastYear) {
          currentYear = currentYear + displayYearInterval;
          return true;
        }
        return false;
      });
      setVisibleYears([firstYear, ...filteredYears, lastYear]);
    });
  }, [dob]);

  function YearWrap({ year, children }) {
    return (
      <div
        className="flex-1 min-w-full flex items-center justify-center z-10"
        onMouseEnter={() => setHoverYear(year)}
        onMouseLeave={() => {
          setHoverYear(null);
        }}
      >
        {children}
      </div>
    );
  }

  function TimelineMarker() {
    return (
      <div
        className="absolute top-0 left-1/2 border border-lightGold h-full w-px"
        style={{
          transform: "translateX(-50%)",
        }}
      ></div>
    );
  }
  return (
    <div
      id="scroll-navigator"
      className="bg-white rounded shadow relative flex flex-col justify-between items-center w-full h-full py-3"
    >
      <TimelineMarker />
      {visibleYears.map((year, index) => {
        if (hoverYear && hoverYear === year) {
          return (
            <YearWrap key={index}>
              <div
                className="bg-white font-medium cursor-pointer text-center border-b-2 py-1/2 px-1 border-black animate-expand"
                onClick={() => scrollToYear(year)}
              >
                {year}
              </div>
            </YearWrap>
          );
        } else if (
          // First, last, or every 3rd
          index === 0 ||
          index === visibleYears.length - 1 ||
          index % 3 === 0
        ) {
          return (
            <YearWrap year={year} key={index}>
              <div className={`bg-white text-center`}>{year}</div>
            </YearWrap>
          );
        } else {
          return (
            <YearWrap year={year} key={index}>
              <span
                className={`w-2 h-2 border rounded-full border-gold bg-lightGray`}
              ></span>
            </YearWrap>
          );
        }
      })}
    </div>
  );
}

export default React.memo(ScrollNavigator);
