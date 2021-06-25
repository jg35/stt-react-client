import React from "react";
import Fragment from "./fragment";

export default function FragmentList({ fragments }) {
  return fragments.map((fragment, index) => (
    <Fragment key={fragment.id} fragment={fragment} />
  ));
}
