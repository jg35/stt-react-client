import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_TIMELINE_VIEW, FETCH_LOCAL_UI_STATE } from "~/lib/gql";

import Page from "~/components/page";

import CaptureModal from "~/components/capture/captureModal";
import CaptureHeader from "~/components/capture/captureHeader";
import Section from "~/components/timeline/section";
import Preview from "~/components/timeline/preview";
import { AuthContext } from "~/components/authWrap";

import ScrollNavigator from "~/components/timeline/scrollNavigator";

import { generateTimeline } from "~/lib/timeline";
import TimePeriodSelector from "~/components/timeline/timePeriodSelector";

import TimelineSkeleton from "~/components/timeline/timelineSkeleton";

export default function Timeline() {
  const user = useContext(AuthContext);
  const { data: uiStateData } = useQuery(FETCH_LOCAL_UI_STATE);
  const { data, loading } = useQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: user.id,
    },
  });

  const [fragments, setFragments] = useState(null);
  const [timeline, setTimeline] = useState(null);

  const timelinePeriod = uiStateData.uiState.timelinePeriod;

  useEffect(() => {
    if (data) {
      const [timeline, sortedFragments] = generateTimeline(
        data,
        timelinePeriod
      );
      setTimeline(timeline);
      setFragments(sortedFragments);
    }
  }, [data, timelinePeriod]);

  return (
    <Page>
      <div className="flex h-full">
        <div className="flex-1">
          <div className="h-32 shadow rounded-lg bg-white p-4 flex">
            <CaptureHeader init={!loading} />
          </div>
          <div className="flex py-4" style={{ height: "calc(100% - 8rem)" }}>
            <div className="flex shadow-lg min-w-full rounded-lg bg-white px-3">
              {timeline ? (
                <>
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
                </>
              ) : (
                <TimelineSkeleton />
              )}
            </div>
          </div>
        </div>
        <Preview fragments={fragments} />
      </div>
      <CaptureModal init={!loading} />
    </Page>
  );
}
