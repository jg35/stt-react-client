import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { Button, Grid } from "~/components/_styled";
import Svg from "~/components/svg";

import { filterFinderData, getMonthItems } from "~/components/dateInput/lib";
import DateFinderWrapper from "~/components/dateInput/dateFinderWrapper";
import DateFinderItem from "~/components/dateInput/dateFinderItem";
import DateFinderCalendar from "~/components/dateInput/dateFinderCalendar";
import ExpandedDate from "~/components/dateInput/expandedDate";

function getDate(detailLevel, date, fullDateSelected) {
  const dtDate = DateTime.fromISO(date);
  if (fullDateSelected) {
    return dtDate.toFormat("d MMMM yyyy");
  } else {
    switch (detailLevel) {
      case 1:
        return `${dtDate.toFormat("yyyy")}s`;
      case 2:
        return dtDate.toFormat("yyyy");
      case 3:
        return dtDate.toFormat("MMMM yyyy");
      default:
        return null;
    }
  }
}

const getLevelTitle = (level) => {
  switch (level) {
    case 0:
      return "Decades";
    case 1:
      return "Years";
    case 2:
      return "Months";
    case 3:
      return "Days";
  }
};

function getLevelFromType(type) {
  switch (type) {
    case "DECADE":
      return 1;
    case "YEAR":
      return 2;
    case "MONTH":
      return 3;
    default:
      return 0;
  }
}

function genSelectionTree(value, rootTree, rawData) {
  let selectionTree = [];
  const decade = rootTree.items.find((i) => i.date[2] === value.year[2]);
  const year = decade.items.find(
    (i) => i.date.slice(2, 4) === value.year.slice(2, 4)
  );
  if (value.month) {
    const month = year.items.find((i) => i.date.slice(5, 7) === value.month);
    month.items = getMonthItems(DateTime.fromISO(month.date), rawData);
    selectionTree = [rootTree, decade, year, month];
  } else {
    selectionTree = [rootTree, decade, year];
  }

  return [selectionTree, selectionTree.length - 1];
}

export default function DateFinder({
  open,
  setOpen,
  value,
  onChange,
  timelineData,
  inputRef,
  insideModal,
  smartDateDetailLevel,
}) {
  const scrollContainer = useRef(null);
  const [expandedDate, setExpandedDate] = useState(null);
  const [detailLevel, setDetailLevel] = useState(smartDateDetailLevel || 0);
  const [selectionTree, setSelectionTree] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [date, setDate] = useState("");
  const [dateFromOutside, setDateFromOutside] = useState(false);
  const [dateFromPicker, setDateFromPicker] = useState(false);
  const [dobIso, setDobIso] = useState(null);

  function initDateFinder(timelineData, outsideValue) {
    const baseDataTree = filterFinderData(timelineData);
    if (outsideValue.year) {
      const [newSelectionTree, detailLevel] = genSelectionTree(
        outsideValue,
        baseDataTree,
        timelineData
      );
      setSelectionTree(newSelectionTree);
      setDetailLevel(smartDateDetailLevel || detailLevel);
      if (value.day) {
        setDate(`${value.year}-${value.month}-${value.day}`);
        setDateFromOutside(true);
      } else {
        setDateFromOutside(false);
      }
    } else {
      setDate("");
      setSelectionTree([baseDataTree]);
      setDetailLevel(0);
    }
  }

  function closeDateFinder() {
    setOpen(false);
    setTimeout(() => {
      initDateFinder(timelineData, value);
    }, 500);
  }

  useEffect(() => {
    if (timelineData) {
      setDobIso(timelineData.stt_user_by_pk.dob);
      initDateFinder(timelineData, value);
    }
  }, [timelineData, value]);

  useEffect(() => {
    if (selectionTree.length) {
      const newSelectedItem = selectionTree[detailLevel];

      if (newSelectedItem) {
        setSelectedItem({
          ...newSelectedItem,
          items:
            detailLevel === 3
              ? getMonthItems(
                  DateTime.fromISO(newSelectedItem.date),
                  timelineData
                )
              : newSelectedItem.items,
        });
        // TODO this might cause issues
        if (!dateFromOutside) {
          setDate(newSelectedItem.date);
        }
        setDateFromPicker(false);

        if (scrollContainer.current) {
          scrollContainer.current.scrollTop = 0;
        }
      }
    }
  }, [detailLevel, selectionTree, scrollContainer]);

  return (
    <DateFinderWrapper
      insideModal={insideModal}
      open={open}
      closeHandler={closeDateFinder}
      inputRef={inputRef}
    >
      <div className="h-full w-full border-2 border-lightBlack rounded-md shadow-xl bg-lightestGray">
        <div className="bg-lightBlack flex justify-between items-center p-2">
          <Button
            size="compact"
            variant="nothing"
            onClick={closeDateFinder}
            css="w-24 text-gray font-medium hover:text-white justify-start"
          >
            Close
          </Button>
          <div className="flex justify-end">
            {date ? (
              <Button
                size="compact"
                variant="nothing"
                onClick={() => {
                  let inputDate = date;
                  if (date < dobIso) {
                    inputDate = dobIso;
                  }
                  const dtDate = DateTime.fromISO(inputDate);
                  if (
                    date < dobIso ||
                    smartDateDetailLevel ||
                    dateFromPicker ||
                    detailLevel === 4
                  ) {
                    onChange({
                      year: dtDate.toFormat("yyyy"),
                      month: dtDate.toFormat("M"),
                      day: dtDate.toFormat("d"),
                    });
                  } else if (detailLevel <= 2) {
                    onChange({
                      year: dtDate.toFormat("yyyy"),
                      month: "",
                      day: "",
                    });
                  } else if (detailLevel === 3) {
                    onChange({
                      year: dtDate.toFormat("yyyy"),
                      month: dtDate.toFormat("M"),
                      day: "",
                    });
                  }
                  setOpen(false);
                }}
                css="hover:bg-black text-offWhite w-auto font-medium flex items-center bg-darkGray shadow-xl py-2"
              >
                <span>
                  Select{" "}
                  {getDate(
                    detailLevel,
                    date,
                    dateFromOutside || dateFromPicker
                  )}
                </span>
                <Svg
                  name="calendar"
                  size={24}
                  css="ml-1"
                  color="currentColor"
                />
              </Button>
            ) : (
              <span className="text-gray font-medium py-2 px-1.5 border-2 border-transparent flex items-center justify-center rounded">
                No date selected{" "}
                <Svg
                  name="calendar"
                  size={24}
                  css="ml-1"
                  color="currentColor"
                />
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="relative h-12">
            <Grid
              colSpan={["col-span-4", "col-span-4 text-center"]}
              css="items-center h-full"
            >
              <div>
                {detailLevel > 0 && (
                  <Button
                    css="w-auto text-gray font-medium hover:text-darkGray"
                    variant="nothing"
                    size="compact"
                    onClick={() => {
                      const newTree = selectionTree.slice(
                        0,
                        selectionTree.length - 1
                      );
                      setSelectionTree(newTree);
                      setDetailLevel(newTree.length - 1);
                    }}
                  >
                    <Svg
                      name="chevronLeft"
                      size={14}
                      color="currentColor"
                      css="mr-1"
                    />
                    {getLevelTitle(detailLevel - 1)}
                  </Button>
                )}
              </div>
              <div className="text-darkGray py-1 font-medium">
                {getLevelTitle(detailLevel)}
              </div>
            </Grid>
          </div>

          <div
            ref={scrollContainer}
            className="px-2 overflow-y-scroll "
            style={{ height: "320px" }}
          >
            {selectedItem && selectedItem.type === "MONTH" ? (
              <DateFinderCalendar
                monthItems={selectedItem.items}
                setExpanded={setExpandedDate}
                currentDate={date}
                onChange={(date) => {
                  setDate(date);
                  setDateFromOutside(false);
                  setDateFromPicker(true);
                }}
              />
            ) : (
              selectedItem?.items.map((item, i) => (
                <DateFinderItem
                  item={item}
                  key={i}
                  selectItem={(item) => {
                    setDateFromOutside(false);
                    setSelectionTree(selectionTree.concat(item));
                    setDetailLevel(getLevelFromType(item.type));
                  }}
                />
              ))
            )}
          </div>
          <ExpandedDate
            date={expandedDate}
            expanded={expandedDate !== null}
            setExpanded={setExpandedDate}
            onChange={(date) => {
              setDate(date);
              setDateFromOutside(false);
              setDateFromPicker(true);
              setExpandedDate(null);
            }}
          />
        </div>
      </div>
    </DateFinderWrapper>
  );
}
