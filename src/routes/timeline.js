import React, { useEffect, useState, useCallback } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  FETCH_TIMELINE,
  UPDATE_VERSION,
  FETCH_LOCAL_UI_STATE,
} from "../lib/gql";

import Page from "../components/page";

import CaptureModal from "../components/capture/captureModal";
import Section from "../components/timeline/section";
import Preview from "../components/timeline/preview";
import Button from "../components/button";
import ScrollNavigator from "../components/timeline/scrollNavigator";

import { generateTimeline } from "../lib/timeline";
import { changeTimelinePeriod } from "../lib/apollo";
import { cloneDeep, debounce } from "lodash";

export default function Timeline() {
  const { data } = useQuery(FETCH_TIMELINE);
  const { data: uiStateData } = useQuery(FETCH_LOCAL_UI_STATE);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [fragments, setFragments] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [version, setVersion] = useState({});
  const [order, setOrder] = useState(null);

  const timelinePeriod = uiStateData.uiState.timelinePeriod;

  useEffect(() => {
    if (data) {
      const user = data.stt_user[0];
      const [fragments, timeline] = generateTimeline(
        user,
        data.stt_userEvent,
        data.stt_worldEvent,
        data.stt_fragment,
        timelinePeriod
      );
      setTimeline(timeline);
      setFragments(fragments);
      setVersion(user.versions[0]);
    }
  }, [data, uiStateData]);

  const sortHandler = useCallback(
    debounce(
      (order, id) =>
        updateVersion({
          variables: {
            id,
            data: {
              fragmentOrder: order,
            },
          },
        }),
      3000
    ),
    []
  );

  function setFragmentOrder(
    fragmentGroupOrderedIds,
    firstFragmentId,
    debounce = true
  ) {
    const newOrder = cloneDeep(order || version.fragmentOrder);
    const offset = newOrder[firstFragmentId];
    fragmentGroupOrderedIds.forEach((id, index) => {
      newOrder[id] = index + (offset || 0);
    });
    const syncedOrder = {};
    // Any deleted fragments
    fragments.forEach((f) => {
      syncedOrder[f.id] = newOrder[f.id];
    });
    setFragments(
      [...fragments].sort((a, b) =>
        syncedOrder[a.id] < syncedOrder[b.id] ? -1 : 1
      )
    );
    if (debounce) {
      sortHandler(syncedOrder, version.id);
    } else {
      updateVersion({
        variables: {
          id: version.id,
          data: {
            fragmentOrder: syncedOrder,
          },
        },
      });
    }

    setOrder(syncedOrder);
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
                  <main className="flex-1 mr-2 max-h-full overflow-auto js-timeline-scroll-container relative">
                    {timeline.map((timelineSection, i) => (
                      <Section
                        key={i}
                        section={timelineSection}
                        setFragmentOrder={(newOrder) =>
                          setFragmentOrder(
                            newOrder,
                            timelineSection.firstFragmentId
                          )
                        }
                      />
                    ))}
                    <div className="h-10 bg-white sticky bottom-4 w-max flex items-center shadow-lg py-6 px-4 rounded border">
                      <span className="font-medium mr-2">
                        View timeline in:
                      </span>
                      <Button
                        onClick={() => changeTimelinePeriod("MONTH")}
                        css={`mx-2 ${
                          timelinePeriod === "MONTH" && "underline"
                        }`}
                      >
                        Months
                      </Button>
                      <Button
                        onClick={() => changeTimelinePeriod("SEASON")}
                        css={`mx-2 ${
                          timelinePeriod === "SEASON" && "underline"
                        }`}
                      >
                        Seasons
                      </Button>
                      <Button
                        onClick={() => changeTimelinePeriod("YEAR")}
                        css={`
                          ${timelinePeriod === "YEAR" && "underline"}
                        `}
                      >
                        Years
                      </Button>
                    </div>
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
      <CaptureModal />
    </Page>
  );
}
