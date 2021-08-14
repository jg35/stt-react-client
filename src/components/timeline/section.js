import React, { useState } from "react";
import { debounce } from "lodash";

import FragmentList from "~/components/timeline/fragmentList";
import UserEvent from "~/components/timeline/userEvent";
import WorldEvent from "~/components/timeline/worldEvent";
import SectionCaptureActions from "~/components/timeline/sectionCaptureActions";
import { Title, Text } from "~/components/_styled";

export default function Section({ section, index }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <section
      className="py-8 pr-6 border-b border-lightGray"
      data-season-year={section.year}
      data-section-index={index}
      onMouseEnter={() => setShowActions(true)}
      onMouseOver={debounce(() => setShowActions(true), 200)}
      onMouseLeave={debounce(() => setShowActions(false), 200)}
    >
      <header className="flex justify-between h-10 pl-2">
        <div className="mb-4 flex items-center">
          <Title size="compact">
            {section.title} &middot;{" "}
            <Text tag="span" size="large" css="text-gray">
              {section.age}
            </Text>
          </Title>
        </div>

        <SectionCaptureActions
          show={showActions}
          date={section.startDate}
          index={index}
        />
      </header>
      {section.events.length > 0 && (
        <>
          <div className="flex flex-wrap mt-2 pl-2" id="section-events-grid">
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
