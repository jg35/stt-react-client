import React, { useState } from "react";

import FragmentList from "./fragmentList";
import UserEvent from "./userEvent";
import WorldEvent from "./worldEvent";
import SectionCaptureActions from "./sectionCaptureActions";
import Button from "../button";

export default function Section({ section, setFragmentOrder }) {
  const [showActions, setShowActions] = useState(false);

  function reorderByDate() {
    const newOrder = [...section.fragments]
      .sort((a, b) => a.date - b.date || a.id - b.id)
      .map((f) => f.id);
    setFragmentOrder(newOrder, section.firstFragmentId, false);
  }
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
          <SectionCaptureActions
            show={showActions}
            startDate={section.startDate}
          />
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
          <FragmentList
            fragments={section.fragments}
            setFragmentOrder={setFragmentOrder}
          />
        </div>
      )}
      {section.fragments.length > 1 && (
        <div className="flex items-center justify-end rounded m-4 h-8">
          {section.orderType === "MANUAL" ? (
            <Button
              onClick={() => reorderByDate()}
              minimal
              css="font-medium  text-darkGray"
            >
              Reset to date order
            </Button>
          ) : (
            <span className="font-medium text-darkGray">
              Sorted by date (auto)
            </span>
          )}
        </div>
      )}
    </section>
  );
}
