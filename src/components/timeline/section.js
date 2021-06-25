import React, { useState } from "react";

import FragmentList from "./fragmentList";
import UserEvent from "./userEvent";
import WorldEvent from "./worldEvent";
import SectionCaptureActions from "./sectionCaptureActions";
import Button from "../button";

export default function Section({ section }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <section
      className="py-8 pr-6 border-b border-lightGray"
      data-season-year={section.year}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <header className="flex justify-between h-10 pl-2">
        <div className="flex items-center">
          <h1 className="text-lg font-medium">
            {section.title} &middot;{" "}
            <span className="text-gray">{section.age}</span>
          </h1>
        </div>
        <div>
          <SectionCaptureActions show={showActions} date={section.startDate} />
        </div>
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
