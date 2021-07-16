import React from "react";
import Fragment from "~/components/timeline/fragment";

export default function FragmentList({ fragments, editView = false }) {
  return fragments.map((fragment) => (
    <div className="mx-2 my-6">
      <Fragment key={fragment.id} fragment={fragment} editView={editView} />
    </div>
  ));
}
