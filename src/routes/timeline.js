import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { FETCH_TIMELINE, FETCH_FRAGMENTS } from "../lib/gql";

import Page from "../components/page";

import Section from "../components/timeline/section";
import ScrollNavigator from "../components/timeline/scrollNavigator";

import { generateTimeline } from "../lib/timeline";

export default function Timeline() {
  const { data } = useQuery(FETCH_TIMELINE);
  const [timeline, setTimeline] = useState(null);

  useEffect(() => {
    if (data) {
      setTimeline(generateTimeline(data.stt_user[0], data.stt_worldEvent));
    }
  }, [data]);

  return (
    <Page>
      <div className="h-1/6 shadow rounded-lg bg-white p-6">
        <h1>Capture zone</h1>
      </div>
      <DndProvider backend={HTML5Backend}>
        {timeline ? (
          <div className="flex h-5/6 py-4">
            <div className="flex shadow-lg min-w-full rounded-lg bg-white px-3">
              <main className="flex-grow mr-2 max-h-full overflow-auto js-fragment-scroll-container">
                {timeline.map((timelineSection, i) => (
                  <Section key={i} section={timelineSection} />
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
    </Page>
  );
}
