import React from "react";
import Fragment from "~/components/timeline/fragment";

export default function FragmentList({ fragments, editView = false }) {
  return (
    <div className="flex flex-wrap">
      {fragments.map((fragment) => (
        <div className="p-4" style={{ height: "250px", width: "300px" }}>
          <Fragment key={fragment.id} fragment={fragment} editView={editView} />
        </div>
      ))}
    </div>
  );
}
