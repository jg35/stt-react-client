import React from "react";
import Fragment from "~/components/timeline/fragment";

export default function FragmentList({ fragments, editView = false }) {
  return (
    <div className="flex flex-wrap">
      {fragments.map((fragment) => (
        <div
          className="px-2 py-6 w-4/12 min-h-full"
          style={{ maxWidth: "300px" }}
        >
          <Fragment key={fragment.id} fragment={fragment} editView={editView} />
        </div>
      ))}
    </div>
  );
}
