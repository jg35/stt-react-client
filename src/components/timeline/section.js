import React, { useState } from "react";
import { debounce } from "lodash";

import FragmentList from "~/components/timeline/fragmentList";
import UserEvent from "~/components/timeline/userEvent";
import WorldEvent from "~/components/timeline/worldEvent";
import SectionCaptureActions from "~/components/timeline/sectionCaptureActions";
import { Grid, Title, Text } from "~/components/_styled";

export default function Section({
  section,
  index,
  isLast,
  timelinePeriod,
  userDob,
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className={`px-1 ${!isLast && "mb-4"}`}>
      <section
        className={`bg-white shadow pt-4 md:pt-6 pb-2 px-4 md:pr-6 rounded-r`}
        data-season-year={section.year}
        data-section-index={index}
        onMouseEnter={() => setShowActions(true)}
        onMouseOver={debounce(() => setShowActions(true), 200)}
        onMouseLeave={debounce(() => setShowActions(false), 200)}
      >
        <header className="pb-4" style={{ minHeight: "3rem" }}>
          <Grid
            colSpan={["col-span-5 flex items-center", "col-span-7"]}
            gap="gap-x-2 md:gap-x-4"
          >
            <div className="flex flex-col md:flex-row md:items-center">
              <Title size="default" css="flex items-center mb-0">
                {timelinePeriod !== "YEAR" && (
                  <span className="md:hidden">
                    {section.title.replace(/\d{4}(.+)?$/, (m1) => {
                      return m1.slice(-2);
                    })}
                  </span>
                )}
                <span
                  className={`${
                    timelinePeriod !== "YEAR" && "hidden md:block"
                  }`}
                >
                  {section.title}
                </span>
              </Title>
              <Text
                tag="span"
                size="compact"
                css="md:ml-2 text-gray text-base md:text-lg"
              >
                <span className="hidden md:inline">&middot;&nbsp;</span>
                {section.age}
              </Text>
            </div>

            <SectionCaptureActions
              show={showActions}
              startDate={section.startDate}
              endDate={section.endDate}
              userDob={userDob}
              index={index}
            />
          </Grid>
        </header>
        {(section.userEvents.length > 0 || section.worldEvents.length > 0) && (
          <>
            <div
              className="flex whitespace-nowrap lg:whitespace-wrap overflow-x-scroll lg:flex-wrap"
              id="section-events-grid"
            >
              {section.userEvents.map((e, i) => {
                return <UserEvent event={e} key={i} />;
              })}

              {section.worldEvents.map((e, i) => {
                return <WorldEvent event={e} key={i} />;
              })}
            </div>
          </>
        )}
        {section.fragments.length > 0 && (
          <FragmentList fragments={section.fragments} />
        )}
      </section>
    </div>
  );
}
