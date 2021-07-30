import React, { useEffect, useState, useContext, useRef } from "react";
import { debounce, values } from "lodash";
import { useQuery } from "@apollo/client";

import { FETCH_TIMELINE_VIEW } from "~/lib/gql";

import Page from "~/components/page";

import CaptureModal from "~/components/capture/captureModal";
import CaptureHeader from "~/components/capture/captureHeader";
import Section from "~/components/timeline/section";
import Preview from "~/components/timeline/preview";
import { AuthContext } from "~/components/authWrap";

import ScrollNavigator from "~/components/timeline/scrollNavigator";

import { generateTimeline, scrollToFragment } from "~/lib/timeline";
import TimePeriodSelector from "~/components/timeline/timePeriodSelector";

import TimelineSkeleton from "~/components/timeline/timelineSkeleton";
import OrphanedFragments from "~/components/timeline/orphanedFragments";
import { UIContext } from "~/app";

export default function Timeline() {
  const { user } = useContext(AuthContext);
  const { uiState, updateUiState } = useContext(UIContext);
  const timelineScrollContainer = useRef(null);
  const { data, loading } = useQuery(FETCH_TIMELINE_VIEW, {
    variables: {
      userId: user.id,
    },
  });
  const [fragments, setFragments] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [orphanedFragments, setOrphanedFragments] = useState([]);

  const timelinePeriod = uiState.timelinePeriod;

  useEffect(() => {
    if (data) {
      const [timeline, sortedFragments, undatedMemories] = generateTimeline(
        data,
        timelinePeriod
      );

      setTimeline(timeline);
      setFragments(sortedFragments);
      setOrphanedFragments(undatedMemories);
    }
  }, [data, timelinePeriod]);

  useEffect(() => {
    const lastScrollPosition = uiState.timelineScrollPosition;
    if (!loading && timelineScrollContainer && lastScrollPosition) {
      setTimeout(() => {
        if (timelineScrollContainer.current) {
          timelineScrollContainer.current.scrollTo(0, lastScrollPosition);
        }
      });
    }
  }, [timelineScrollContainer, loading]);

  return (
    <Page>
      <div className="flex h-full">
        <div className="flex-1">
          <div className="h-32 shadow rounded-lg bg-white p-4 flex">
            <CaptureHeader init={!loading} />
          </div>
          <div className="flex py-4" style={{ height: "calc(100% - 8rem)" }}>
            <div className="flex shadow-lg min-w-full rounded-lg bg-white px-3">
              {data && data.stt_user_by_pk.dob && timeline ? (
                <>
                  <main
                    id="timeline-scroll-container"
                    ref={timelineScrollContainer}
                    className="flex-1 mr-2 max-h-full overflow-auto js-timeline-scroll-container relative"
                    onScroll={debounce((e) => {
                      if (
                        e.target.scrollTop !== uiState.timelineScrollPosition
                      ) {
                        updateUiState({
                          timelineScrollPosition: e.target.scrollTop,
                        });
                      }
                    }, 1000)}
                  >
                    {timeline.map((timelineSection, i) => (
                      <Section key={i} section={timelineSection} index={i} />
                    ))}
                    {orphanedFragments.length > 0 && (
                      <OrphanedFragments fragments={orphanedFragments} />
                    )}
                    <TimePeriodSelector
                      timelinePeriod={timelinePeriod}
                      orphanCount={orphanedFragments.length}
                    />
                  </main>
                  <div className="w-12 max-h-full">
                    <ScrollNavigator
                      dob={data.stt_user_by_pk.dob}
                      years={values(
                        timeline.reduce((years, season) => {
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
                        }, {})
                      )}
                    />
                  </div>
                </>
              ) : (
                <TimelineSkeleton />
              )}
            </div>
          </div>
        </div>
        <Preview
          fragments={fragments}
          theme={data && data.stt_version[0].theme}
        />
      </div>
      <CaptureModal
        scrollToFragment={debounce((fragmentId) => {
          scrollToFragment(fragmentId);
        }, 500)}
      />
    </Page>
  );
}
