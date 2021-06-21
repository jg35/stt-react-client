import React, { useCallback, useState, useEffect } from "react";
import update from "immutability-helper";
import Fragment from "./fragment";

export default function FragmentList({ fragments, setFragmentOrder }) {
  const [orderedFragments, setOrderedFragments] = useState([...fragments]);

  useEffect(() => {
    setOrderedFragments(fragments);
  }, [fragments]);

  const moveFragment = useCallback(
    (dragIndex, targetIndex) => {
      const changedFragment = orderedFragments[dragIndex];

      const reorderedFragments = update(orderedFragments, {
        $splice: [
          [dragIndex, 1],
          [targetIndex, 0, changedFragment],
        ],
      });
      setOrderedFragments(reorderedFragments);
      setFragmentOrder(reorderedFragments.map((frag) => frag.id));
    },
    [orderedFragments]
  );

  if (orderedFragments) {
    return orderedFragments.map((fragment, index) => (
      <Fragment
        key={fragment.id}
        index={index}
        id={fragment.id}
        moveFragment={moveFragment}
        fragment={fragment}
      />
    ));
  }
  return null;
}
