import React from "react";

import FragmentList from "./fragmentList";
import UserEvent from "./userEvent";
import WorldEvent from "./worldEvent";
import Button from "../button";

export default function Section({ section }) {
  return (
    <section
      className="py-10 pl-3 pr-6 border-b border-lightGray"
      data-season-year={section.year}
    >
      <header className="flex justify-between">
        <h1 className="text-lg font-medium">
          {section.title} &middot;{" "}
          <span className="text-gray">{section.age}</span>
        </h1>
        <div className="flex">
          <Button css="mr-3">Add memory</Button>
          <Button css="mr-3">Add event</Button>
          <Button css="mr-3">Add photo</Button>
          <Button css="mr-3">Add chapter</Button>
        </div>
      </header>
      <div className="flex flex-wrap mt-2">
        {section.events.map((e, i) => (
          <UserEvent event={e} key={i} />
        ))}
        {section.worldEvents.map((e, i) => (
          <WorldEvent event={e} key={i} />
        ))}
      </div>
      <div className="flex flex-wrap mt-6">
        <FragmentList fragments={section.fragments} />
      </div>
    </section>
  );
}
