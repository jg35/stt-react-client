import { motion } from "framer-motion";
import Svg from "~/components/svg";
import { Grid, Button, Title, Text } from "~/components/_styled";
import { DateTime } from "luxon";
import { sortBy, flatten } from "lodash";
import DateFinderEvent from "~/components/dateInput/dateFinderEvent";

function getDate(date = null) {
  if (date) {
    const dtDate = DateTime.fromISO(date);
    return dtDate.toFormat("d MMM yyyy");
  }
  return "";
}

export default function ExpandedDate({
  expanded,
  setExpanded,
  date,
  onChange,
}) {
  if (expanded) {
    const dateEvents = sortBy(
      flatten([date.worldEvents, date.userEvents]),
      "date"
    );
    return (
      <div className="absolute top-0 left-0 w-full h-full z-40">
        <div className="relative h-12 bg-lightGray">
          <Grid
            colSpan={["col-span-4", "col-span-4 text-center"]}
            css="items-center h-full"
          >
            <Button
              css="w-auto text-gray font-medium hover:text-darkGray"
              variant="nothing"
              size="compact"
              onClick={() => setExpanded(null)}
            >
              <Svg
                name="chevronLeft"
                size={14}
                color="currentColor"
                css="mr-1"
              />
              Back
            </Button>

            <div className="text-darkGray py-1 font-medium">
              {getDate(date?.date)}
            </div>
          </Grid>
        </div>
        <motion.div
          initial="hidden"
          animate={expanded ? "visible" : "hidden"}
          variants={{
            hidden: {
              opacity: 0,
              height: 0,
            },
            visible: {
              opacity: 1,
              height: "calc(100% - 3.5rem)",
              top: "0rem",
              left: ".5rem",
            },
          }}
          style={{
            width: "calc(100% - 1rem)",
          }}
          className="bg-darkGray hover:bg-lightBlack rounded-md shadow-md z-50 flex cursor-pointer relative overflow-hidden"
          onClick={() => onChange(date.date)}
        >
          <div className="w-11/12 bg-white p-3">
            {date && (
              <div>
                <Title css="mb-2">Events</Title>
                <div className="border-b border-lightGray flex flex-wrap pb-4 mb-4">
                  {dateEvents.length ? (
                    dateEvents.map((ev, i) => (
                      <DateFinderEvent
                        key={i}
                        event={ev}
                        isUserEvent={ev.__typename === "stt_userEvent"}
                      />
                    ))
                  ) : (
                    <Text css="text-gray">No events on this date</Text>
                  )}
                </div>
                <Title css="mb-2">Memories</Title>
                <div>
                  {date.fragments.length ? (
                    date.fragments.map((f) => {
                      return (
                        <Text css="bg-lightestGray my-1 py-1 px-1.5 rounded-lg">{`${f.content.slice(
                          0,
                          197
                        )}...`}</Text>
                      );
                    })
                  ) : (
                    <Text css="text-gray">No memories on this date</Text>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="w-1/12 flex items-center justify-center">
            <Svg name="chevronRight" size={14} color="white" />
          </div>
        </motion.div>
      </div>
    );
  }
  return null;
}
