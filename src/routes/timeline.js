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
import CaptureHeader from "../components/capture/captureHeader";
import Section from "../components/timeline/section";
import Preview from "../components/timeline/preview";
import Button from "../components/button";
import ScrollNavigator from "../components/timeline/scrollNavigator";

import { generateTimeline } from "../lib/timeline";
import { changeTimelinePeriod } from "../lib/apollo";
import { cloneDeep, debounce, uniq } from "lodash";

export default function Timeline() {
  const { data } = useQuery(FETCH_TIMELINE);
  const { data: uiStateData } = useQuery(FETCH_LOCAL_UI_STATE);
  const [updateVersion] = useMutation(UPDATE_VERSION);
  const [fragments, setFragments] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [version, setVersion] = useState({});
  const [fragmentOrder, setFragmentOrder] = useState(null);

  const timelinePeriod = uiStateData.uiState.timelinePeriod;

  useEffect(() => {
    if (data) {
      const user = data.stt_user[0];
      const [fragments, timeline, order] = generateTimeline(
        user,
        data.stt_userEvent,
        data.stt_worldEvent,
        data.stt_fragment,
        timelinePeriod
      );
      setTimeline(timeline);
      setFragments(fragments);
      setVersion(user.versions[0]);
      setFragmentOrder(order);
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

  function setFragmentOrderHandler(sectionOrder, debounce = true) {
    let deleteCount = sectionOrder.length;
    let startIndex;
    for (let i = 0; i < fragmentOrder.length; i++) {
      if (sectionOrder.includes(fragmentOrder[i])) {
        startIndex = i;
        break;
      }
    }
    let newOrder = [...fragmentOrder];
    newOrder.splice(startIndex, deleteCount, ...sectionOrder);

    if (debounce) {
      sortHandler(newOrder, version.id);
    } else {
      updateVersion({
        variables: {
          id: version.id,
          data: {
            fragmentOrder: newOrder,
          },
        },
      });
    }

    setFragmentOrder(newOrder);

    setFragments(
      [...fragments].sort((a, b) =>
        newOrder.indexOf(a.id) < newOrder.indexOf(b.id) ? -1 : 1
      )
    );
  }

  return (
    <Page>
      <div className="flex max-h-full">
        <div className="flex-1">
          <div className="h-32 shadow rounded-lg bg-white p-4 flex">
            {fragments && (
              <CaptureHeader
                questionsAnswered={uniq(fragments.map((f) => f.questionId))}
              />
            )}
          </div>
          <DndProvider backend={HTML5Backend}>
            {timeline ? (
              <div
                className="flex py-4"
                style={{ height: "calc(100% - 8rem)" }}
              >
                <div className="flex shadow-lg min-w-full rounded-lg bg-white px-3">
                  <main className="flex-1 mr-2 max-h-full overflow-auto js-timeline-scroll-container relative">
                    {timeline.map((timelineSection, i) => (
                      <Section
                        key={i}
                        section={timelineSection}
                        setFragmentOrder={setFragmentOrderHandler}
                      />
                    ))}
                    <div className="h-10 bg-white sticky bottom-4 w-max flex items-center shadow-lg py-6 px-4 rounded border">
                      <span className="font-medium mr-2">
                        View timeline in:
                      </span>
                      <Button
                        onClick={() => changeTimelinePeriod("YEAR")}
                        css={`
                          ${timelinePeriod === "YEAR" && "underline"}
                        `}
                      >
                        Years
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
                        onClick={() => changeTimelinePeriod("MONTH")}
                        css={`mx-2 ${
                          timelinePeriod === "MONTH" && "underline"
                        }`}
                      >
                        Months
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
