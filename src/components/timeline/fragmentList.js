import React, { useState, useCallback, useEffect, useMemo } from "react";
import { isEqual } from "lodash";
import update from "immutability-helper";
import { useMutation } from "@apollo/client";
import { UPDATE_VERSION } from "../../lib/gql";
import Fragment from "./fragment";

export default function FragmentList({ fragments }) {
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [sortedFragments, setSortedFragments] = useState(null);

  function handleSort(fragmentOrder) {
    updateVersion({
      variables: {
        id: 34,
        data: {
          fragmentOrder,
        },
      },
    });
  }

  useEffect(() => {
    if (fragments && !sortedFragments) {
      setSortedFragments([...fragments]);
    }
  }, [fragments, sortedFragments]);

  const moveFragment = useCallback(
    (dragIndex, targetIndex) => {
      const changedFragment = sortedFragments[dragIndex];

      const reorderedFragments = update(sortedFragments, {
        $splice: [
          [dragIndex, 1],
          [targetIndex, 0, changedFragment],
        ],
      });
      const newOrder = reorderedFragments.map((frag) => frag.id);
      const currentOrder = sortedFragments.map((frag) => frag.id);

      if (!isEqual(newOrder, currentOrder)) {
        handleSort(newOrder);
        setSortedFragments(reorderedFragments);
      }
    },
    [sortedFragments]
  );

  if (sortedFragments) {
    return sortedFragments.map((fragment, index) => (
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
