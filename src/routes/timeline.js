import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_TIMELINE, FETCH_LOCAL_UI_STATE } from "../lib/gql";

import Page from "../components/page";

import CaptureModal from "../components/capture/captureModal";
import CaptureHeader from "../components/capture/captureHeader";
import Section from "../components/timeline/section";
import Preview from "../components/timeline/preview";

import ScrollNavigator from "../components/timeline/scrollNavigator";

import { generateTimeline } from "../lib/timeline";

import { uniq } from "lodash";
import TimePeriodSelector from "../components/timeline/timePeriodSelector";

function sortFragments(fragments) {
  return [...fragments].sort((a, b) => {
    if (a.date === b.date) {
      return a.id < b.id ? -1 : 1;
    }
    return a.date < b.date ? -1 : 1;
  });
}

export default function Timeline() {
  const { data } = useQuery(FETCH_TIMELINE);
  const { data: uiStateData } = useQuery(FETCH_LOCAL_UI_STATE);
  const [fragments, setFragments] = useState(null);
  const [timeline, setTimeline] = useState(null);

  const timelinePeriod = uiStateData.uiState.timelinePeriod;

  useEffect(() => {
    if (data) {
      const sortedFragments = sortFragments(data.stt_fragment);
      const timeline = generateTimeline(
        data.stt_user[0],
        data.stt_userEvent,
        data.stt_worldEvent,
        sortedFragments,
        timelinePeriod
      );
      setTimeline(timeline);
      setFragments(sortedFragments);
    }
  }, [data, uiStateData]);

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

          {timeline ? (
            <div className="flex py-4" style={{ height: "calc(100% - 8rem)" }}>
              <div className="flex shadow-lg min-w-full rounded-lg bg-white px-3">
                <main className="flex-1 mr-2 max-h-full overflow-auto js-timeline-scroll-container relative">
                  {timeline.map((timelineSection, i) => (
                    <Section key={i} section={timelineSection} />
                  ))}
                  <TimePeriodSelector timelinePeriod={timelinePeriod} />
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
        </div>
        {fragments && <Preview fragments={fragments} />}
      </div>
      <CaptureModal />
    </Page>
  );
}
