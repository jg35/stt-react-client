import React, { useState } from "react";
import { debounce } from "lodash";

import FragmentList from "~/components/timeline/fragmentList";
import UserEvent from "~/components/timeline/userEvent";
import WorldEvent from "~/components/timeline/worldEvent";
import SectionCaptureActions from "~/components/timeline/sectionCaptureActions";

export default function Section({ section, index }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <section
      className="py-8 pr-6 border-b border-lightGray"
      data-season-year={section.year}
      onMouseEnter={() => setShowActions(true)}
      onMouseOver={debounce(() => setShowActions(true), 200)}
      onMouseLeave={debounce(() => setShowActions(false), 200)}
    >
      <header className="flex justify-between h-10 pl-2">
        <div className="mb-4 flex items-center">
          <h1 className="text-lg font-medium">
            {section.title} &middot;{" "}
            <span className="text-gray mb-4">{section.age}</span>
          </h1>
        </div>

        <SectionCaptureActions
          show={showActions}
          date={section.startDate}
          index={index}
        />
      </header>
      {(section.events.length || section.worldEvents.length) > 0 && (
        <>
          <div className="flex flex-wrap mt-2 pl-2">
            {section.events.map((e, i) => (
              <UserEvent event={e} key={i} />
            ))}
            {section.worldEvents.map((e, i) => (
              <WorldEvent event={e} key={i} />
            ))}
          </div>
        </>
      )}
      {section.fragments.length > 0 && (
        <div className="flex flex-wrap mt-4">
          <FragmentList fragments={section.fragments} />
        </div>
      )}
    </section>
  );
}
