import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FETCH_TIMELINE, UPDATE_VERSION } from "../lib/gql";

import Page from "../components/page";

import Section from "../components/timeline/section";
import Preview from "../components/timeline/preview";
import ScrollNavigator from "../components/timeline/scrollNavigator";

import { generateTimeline } from "../lib/timeline";
import { cloneDeep, isEqual, sortBy, values, debounce } from "lodash";

export default function Timeline() {
  const { data } = useQuery(FETCH_TIMELINE);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [fragments, setFragments] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [apiFragmentOrder, setApiFragmentOrder] = useState({});
  const [localFragmentOrder, setLocalFragmentOrder] = useState(null);

  useEffect(() => {
    if (data) {
      const user = data.stt_user[0];
      const version = user.versions[0];
      const [fragments, timeline] = generateTimeline(
        data.stt_user[0],
        data.stt_worldEvent
      );
      setTimeline(timeline);
      setFragments(fragments);
      setApiFragmentOrder(
        version.fragmentOrder.reduce((obj, fragId, index) => {
          obj[fragId] = { id: fragId, order: index };
          return obj;
        }, {})
      );
    }
  }, [data]);

  const sortHandler = useCallback(
    debounce(
      (fragmentOrder, id) =>
        updateVersion({
          variables: {
            id,
            data: {
              fragmentOrder,
            },
          },
        }),
      3000
    ),
    []
  );

  useEffect(() => {
    if (localFragmentOrder && !isEqual(apiFragmentOrder, localFragmentOrder)) {
      const newOrder = sortBy(values(localFragmentOrder), ["order"]).map(
        (f) => f.id
      );
      setFragments(
        newOrder.map((fragId) => fragments.find((f) => f.id === fragId))
      );
      sortHandler(newOrder, data.stt_user[0].versions[0].id);
    }
  }, [localFragmentOrder]);

  function setFragmentOrder(fragmentGroupOrderedIds, sectionIndex) {
    const newOrder = cloneDeep(localFragmentOrder || apiFragmentOrder);
    const offset = timeline
      .slice(0, sectionIndex)
      .map((t) => t.fragments.length)
      .reduce((total, length) => total + length, 0);

    fragmentGroupOrderedIds.forEach((id, index) => {
      newOrder[id] = { id, order: index + offset };
    });
    setLocalFragmentOrder(newOrder);
  }

  return (
    <Page>
      <div className="flex max-h-full">
        <div className="flex-1">
          <div className="h-1/6 shadow rounded-lg bg-white p-6">
            <h1>Capture zone</h1>
          </div>
          <DndProvider backend={HTML5Backend}>
            {timeline ? (
              <div className="flex h-5/6 py-4">
                <div className="flex shadow-lg min-w-full rounded-lg bg-white px-3">
                  <main className="flex-1 mr-2 max-h-full overflow-auto js-timeline-scroll-container">
                    {timeline.map((timelineSection, i) => (
                      <Section
                        key={i}
                        section={timelineSection}
                        setFragmentOrder={(order) => setFragmentOrder(order, i)}
                      />
                    ))}
                  </main>
                  <div className="w-12 max-h-full">
                    <ScrollNavigator
                      years={(() => {
                        const years = timeline.reduce((years, season) => {
                          if (!years[season.year]) {
                            years[season.year] = {
                              year: season.year,
                              fragments: false,
                            };
                          }
                          if (season.fragments.length) {
                            years[season.year].fragments = true;
                          }
                          return years;
                        }, {});
                        return Object.keys(years).map((k) => years[k]);
                      })()}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <h1>Timeline is loading...</h1>
            )}
          </DndProvider>
        </div>
        {fragments && <Preview fragments={fragments} />}
      </div>
    </Page>
  );
}
