import React, { useEffect, useState, useContext, useRef } from "react";
import { debounce, values, get } from "lodash";
import { useCustomQuery } from "~/hooks/useCustomApollo";

import { FETCH_TIMELINE_VIEW } from "~/lib/gql";

import Page from "~/components/page";
import { Grid, Card } from "~/components/_styled";

import CaptureModal from "~/components/capture/captureModal";
import CaptureHeader from "~/components/capture/captureHeader";
import Section from "~/components/timeline/section";
import Preview from "~/components/timeline/preview";
import ScrollNavigator from "~/components/timeline/scrollNavigator";

import {
  generateTimeline,
  scrollToFragment,
  scrollToEvent,
} from "~/lib/timeline";
import TimePeriodSelector from "~/components/timeline/timePeriodSelector";

import TimelineSkeleton from "~/components/timeline/timelineSkeleton";
import OrphanedFragments from "~/components/timeline/orphanedFragments";
import { UIContext } from "~/app";

export default function Timeline() {
  const { uiState, updateUiState } = useContext(UIContext);
  const timelineScrollContainer = useRef(null);
  const captureHeader = useRef(null);
  const { data, loading } = useCustomQuery(FETCH_TIMELINE_VIEW, {
    name: "FETCH_TIMELINE_VIEW",
    userId: true,
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
    <Page maxWidth="none">
      <div ref={captureHeader}>
        <CaptureHeader init={!loading} />
      </div>

      <div
        className="flex-1 py-4"
        style={{
          height: `calc(100% - ${
            (get(captureHeader, "current.clientHeight") || "0") + "px"
          })`,
        }}
      >
        <Card css="px-2 md:px-4 py-0 flex h-full">
          {data && data.stt_user_by_pk.dob && timeline ? (
            <>
              <main
                id="timeline-scroll-container"
                ref={timelineScrollContainer}
                className="md:mr-2 overflow-y-scroll overflow-x-hidden js-timeline-scroll-container relative"
                onScroll={debounce((e) => {
                  if (e.target.scrollTop !== uiState.timelineScrollPosition) {
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
              <div className="hidden md:block w-12 min-h-full">
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
        </Card>

        <Preview fragments={fragments} />
      </div>

      <CaptureModal
        scrollToFragment={debounce((fragmentId) => {
          scrollToFragment(fragmentId);
        }, 500)}
        scrollToEvent={debounce((eventId) => {
          scrollToEvent(eventId);
        }, 500)}
      />
    </Page>
  );
}
