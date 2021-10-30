import React, { useEffect, useState, useContext, useRef } from "react";
import { debounce, cloneDeep } from "lodash";
import { useCustomQuery } from "~/hooks/useCustomApollo";

import { FETCH_TIMELINE_VIEW } from "~/lib/gql";

import Page from "~/components/page";

import CaptureModal from "~/components/capture/captureModal";
import CaptureHeader from "~/components/capture/captureHeader";
import Section from "~/components/timeline/section";
import Preview from "~/components/timeline/preview";
import ScrollNavigator from "~/components/timeline/scrollNavigator";
import usePageTitle from "~/hooks/usePageTitle";

import {
  generateTimeline,
  scrollToFragment,
  scrollToEvent,
} from "~/lib/timeline";
import TimePeriodSelector from "~/components/timeline/timePeriodSelector";

import TimelineSkeleton from "~/components/timeline/timelineSkeleton";
import { UIContext } from "~/app";

import {
  getTutorialFragments,
  getTutorialUserEvents,
} from "~/lib/tutorialData";

export default function Timeline() {
  usePageTitle("Timeline");
  const { uiState, updateUiState } = useContext(UIContext);
  const timelineScrollContainer = useRef(null);

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
      let renderData = cloneDeep(data);
      if (uiState.tutorial.active) {
        renderData.stt_fragment = getTutorialFragments();
        renderData.stt_userEvent = getTutorialUserEvents();
        renderData.stt_user_by_pk.dob = "1989-12-02";
      }
      const [timeline, sortedFragments, undatedMemories] = generateTimeline(
        renderData,
        timelinePeriod
      );
      setTimeline(timeline);
      setFragments(sortedFragments);
      setOrphanedFragments(undatedMemories);
    }
  }, [data, timelinePeriod, uiState.tutorial.active]);

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
    <>
      <Page maxWidth="1920px" headerCss="mb-0" pageContentCss="px-0 md:px-0">
        <CaptureHeader init={!loading} />

        <div className="overflow-hidden py-4 px-2 flex bg-offWhite shadow-inner">
          {!timeline && <TimelineSkeleton />}
          {data && data.stt_user_by_pk.dob && timeline && (
            <>
              <main
                id="timeline-scroll-container"
                ref={timelineScrollContainer}
                className="overflow-y-scroll overflow-x-hidden js-timeline-scroll-container flex-1 pb-1"
                onScroll={debounce((e) => {
                  if (e.target.scrollTop !== uiState.timelineScrollPosition) {
                    // Find the current scrolled year and store it
                    const sections = e.target.querySelectorAll("section");
                    const scrollTop = e.target.scrollTop;
                    let currentSection;
                    for (var i = 0; i < sections.length; i++) {
                      if (
                        sections[i].offsetTop - sections[i].clientHeight >=
                          scrollTop ||
                        i === sections.length - 1
                      ) {
                        currentSection = sections[i];
                        break;
                      }
                    }
                    updateUiState({
                      timelineScrollYear:
                        currentSection &&
                        currentSection.getAttribute("data-season-year"),
                      timelineScrollPosition: e.target.scrollTop,
                    });
                  }
                }, 1000)}
              >
                {timeline.map((timelineSection, i) => (
                  <Section
                    key={i}
                    section={timelineSection}
                    timelinePeriod={timelinePeriod}
                    userDob={data.stt_user_by_pk.dob}
                    index={i}
                    isLast={i === timeline.length - 1}
                  />
                ))}
                <TimePeriodSelector
                  timelinePeriod={timelinePeriod}
                  orphanCount={orphanedFragments.length}
                />
              </main>

              {!uiState.showPreview && (
                <div
                  className="hidden md:block min-h-full ml-1 px-1"
                  style={{
                    minWidth: "80px",
                  }}
                >
                  <ScrollNavigator dob={data.stt_user_by_pk.dob} />
                </div>
              )}

              <Preview fragments={fragments} />
            </>
          )}
        </div>
      </Page>
      <CaptureModal
        dob={data?.stt_user_by_pk.dob}
        scrollToFragment={debounce((fragmentId) => {
          scrollToFragment(fragmentId);
        }, 500)}
        scrollToEvent={debounce((eventId) => {
          scrollToEvent(eventId);
        }, 500)}
      />
    </>
  );
}
