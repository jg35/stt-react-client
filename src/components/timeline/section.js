import React, { useState } from "react";
import { debounce } from "lodash";

import FragmentList from "~/components/timeline/fragmentList";
import UserEvent from "~/components/timeline/userEvent";
import WorldEvent from "~/components/timeline/worldEvent";
import SectionCaptureActions from "~/components/timeline/sectionCaptureActions";
import { Grid, Title, Text } from "~/components/_styled";

export default function Section({ section, index, isLast }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <section
      className={`py-12 md:pr-6 ${!isLast && "border-b-2 border-lightGray"}`}
      data-season-year={section.year}
      data-section-index={index}
      onMouseEnter={() => setShowActions(true)}
      onMouseOver={debounce(() => setShowActions(true), 200)}
      onMouseLeave={debounce(() => setShowActions(false), 200)}
    >
      <header className="pb-4 h-12">
        <Grid colSpan={["col-span-5", "col-span-7"]} gap="gap-x-2 md:gap-x-4">
          <Title size="large" css="flex items-center">
            {section.title}
            <Text tag="span" size="compact" css="ml-2 text-gray text-base">
              &middot;&nbsp;{section.age}
            </Text>
          </Title>

          <SectionCaptureActions
            show={showActions}
            date={section.startDate}
            index={index}
          />
        </Grid>
      </header>
      {section.events.length > 0 && (
        <>
          <div
            className="flex whitespace-nowrap lg:whitespace-wrap overflow-x-scroll lg:flex-wrap mt-2"
            id="section-events-grid"
          >
            {section.events.map((e, i) => {
              if (e.userId) {
                return <UserEvent event={e} key={i} />;
              }
              return <WorldEvent event={e} key={i} />;
            })}
          </div>
        </>
      )}
      {section.fragments.length > 0 && (
        <FragmentList fragments={section.fragments} />
      )}
    </section>
  );
}
