import React from "react";
import Fragment from "~/components/timeline/fragment";

export default function FragmentList({ fragments, editView = false }) {
  return (
    <div className="flex md:flex-wrap pl-1 overflow-x-scroll">
      {fragments.map((fragment) => (
        <div
          className="py-2 pr-4"
          style={{ height: "250px", minWidth: "300px" }}
          key={fragment.id}
        >
          <Fragment fragment={fragment} editView={editView} />
        </div>
      ))}
    </div>
  );
}
