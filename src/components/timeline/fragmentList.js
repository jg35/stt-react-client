import React from "react";
import { useMutation, gql, mutat } from "@apollo/client";
import { cloneDeep } from "lodash";
import Fragment from "~/components/timeline/fragment";
import { fragmentFragment } from "~/lib/gql/_fragments";

export default function FragmentList({ fragments, editView = false }) {
  const [orderFragments] = useMutation(
    gql`
      mutation {
        update_stt_fragment
      }
    `
  );
  function moveFragment(fragmentId, fragmentDate, direction) {
    const matchingFragments = cloneDeep(
      fragments.filter((f) => f.date === fragmentDate)
    );
    const moveIndex = matchingFragments.findIndex((f) => f.id === fragmentId);
    const targetIndex = direction === "BACK" ? moveIndex - 1 : moveIndex + 1;

    const target = matchingFragments[targetIndex];
    matchingFragments[targetIndex] = matchingFragments[moveIndex];
    matchingFragments[moveIndex] = target;

    // Filter out ones that have not moved
    const gqlQuery = matchingFragments.reduce((gql, f, i, arr) => {
      if (f.order === i + 1) {
        // skip
        return gql;
      }
      gql = gql += `
        _${i + 1}: update_stt_fragment_by_pk(pk_columns: {id: ${
        f.id
      }}, _set: {order: ${i + 1}}) {
          ...fragmentFragment
        }
      `;
      return gql;
    }, `mutation MoveFragments {`);

    const mutation = gql`
      ${fragmentFragment}
      ${gqlQuery} }
    `;

    return orderFragments({
      mutation,
    });
  }
  return (
    <div className="pl-1 pr-1 pt-6 -mx-2 overflow-x-scroll flex lg:flex-wrap">
      {fragments.map((fragment, i) => {
        const prev = fragments[i - 1] || {};
        const next = fragments[i + 1] || {};
        const matchesPrev = prev.date === fragment.date;
        const matchesNext = next.date === fragment.date;
        const hasSameDate = matchesPrev || matchesNext;
        const isFirst = !matchesPrev && matchesNext;
        const isLast = matchesPrev && !matchesNext;
        return (
          <div
            className="py-2 px-2"
            style={{ height: "250px", minWidth: "300px", maxWidth: "300px" }}
            key={fragment.id}
          >
            <Fragment
              grouped={hasSameDate}
              isFirst={isFirst}
              isLast={isLast}
              fragment={fragment}
              editView={editView}
              moveFragment={moveFragment}
            />
          </div>
        );
      })}
    </div>
  );
}
