import { useState, useEffect } from "react";
import { DateTime } from "luxon";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_TIMELINE_VIEW } from "~/lib/gql";

import Svg from "~/components/svg";
import FormField from "~/components/formField";
import DateFinder from "~/components/dateInput/dateFinder";
import {
  getDateFinderFormat,
  getInputFormat,
} from "~/components/dateInput/lib";
import { getDatePickerAgeCaption } from "~/lib/util";

export default function DateInput({
  handleChange,
  date,
  error,
  placeholder = "yyyy/mm/dd",
  minDate,
  maxDate = null,
  smartDate = null,
  setShowCaption,
  label = "Date",
  caption = null,
}) {
  console.log(smartDate);
  const [inputValue, setInputValue] = useState(null);
  const [currentValue, setCurrentValue] = useState("");
  const [dateFinderValue, setDateFinderValue] = useState("");
  const [dateFinderOpen, setDateFinderOpen] = useState(false);
  const { data: timelineData } = useCustomQuery(FETCH_TIMELINE_VIEW, {
    userId: true,
  });

  // Initialise date from outside
  useEffect(() => {
    if (!currentValue && date) {
      setCurrentValue(date);
    }
  }, [date]);

  // Update the input value when source of truth changes
  useEffect(() => {
    if (currentValue) {
      const ISO = "yyyy-MM-dd";
      const newInputValue = DateTime.fromFormat(
        currentValue,
        ISO.slice(0, currentValue.length)
      ).toFormat("yyyy/MM/dd".slice(0, currentValue.length));

      if (newInputValue !== inputValue) {
        setInputValue(newInputValue);
      }
    }
  }, [currentValue]);

  function onChangeHandler(newVal) {
    if (newVal !== currentValue) {
      handleChange(newVal);
    }
  }

  function getCaption() {
    if (caption) {
      return caption;
    } else if (dateFinderValue) {
      // show age
      return (
        <span className="flex items-center">
          <Svg name="check" size={12} css="mr-0.5" color="green" />
          {getDatePickerAgeCaption(
            dateFinderValue,
            timelineData.stt_user_by_pk.dob
          )}
        </span>
      );
    } else {
      return "Use the date finder, or enter in years, months and days.";
    }
  }

  // Setting the date finder value from changes in the input
  useEffect(() => {
    if (timelineData) {
      if (inputValue === null) {
        return;
      }

      const inputFormat = getInputFormat(inputValue);
      const inputDt = DateTime.fromFormat(
        inputValue.slice(0, inputFormat.length),
        inputFormat
      );
      if (!inputValue.length < 4) {
        setDateFinderValue("");
      }
      if (!inputDt.isValid) {
        onChangeHandler(inputValue);
      } else {
        // All good in DA HOOD
        onChangeHandler(inputDt.toISODate());
        const dobDb = DateTime.fromISO(timelineData.stt_user_by_pk.dob);
        const dayDobOffset = inputDt.diff(dobDb, ["days"]).toObject().days;
        const dayNowOffset = Math.floor(
          DateTime.utc().diff(inputDt, ["days"]).toObject().days
        );
        if (dayNowOffset >= 0 && dayNowOffset >= 0 && inputValue.length >= 4) {
          // Get nearest valid format to pass to dateFinder
          const dfFormat = getDateFinderFormat(inputValue);
          // Find the nearest valid value
          const dfDt = DateTime.fromFormat(
            inputValue.slice(0, dfFormat.length),
            dfFormat
          );
          if (dfDt.isValid) {
            if (dayDobOffset >= 0 && dayNowOffset >= 0) {
              const isoValue = dfDt.toFormat(dfFormat.replaceAll("/", "-"));
              if (isoValue !== dateFinderValue) {
                setDateFinderValue(isoValue);
              }
            }
          }
        }
      }
    }
  }, [inputValue, timelineData]);

  return (
    <FormField label={label} error={error} caption={getCaption()}>
      <div
        className={`relative flex w-auto h-12 border-2 rounded-md ${
          error ? "border-red" : "border-transparent"
        }`}
      >
        <div className="relative">
          <input
            autoComplete="off"
            id="dateFinderInput"
            onChange={(e) => setInputValue(e.target.value)}
            className="input flex-1"
            value={inputValue}
            type="text"
            placeholder={placeholder}
          />
          {smartDate && smartDate.isSmartDate && (
            <span
              className="absolute right-2 top-2.5 border-green border-2 p-1 uppercase font-bold text-xs text-green rounded cursor-help"
              title={
                smartDate.smartDateReason.confidence === 100
                  ? "We've set this date automatically because the question relates to a specific day of your life."
                  : "We've set this date automatically based on the time period or question. It might not be precise."
              }
            >
              Auto
            </span>
          )}
        </div>
        <div
          id="findDateBtn"
          title="Find a date"
          tabIndex="0"
          className="block cursor-pointer px-4 h-full bg-lightBlack text-white justify-center rounded-r flex items-center"
          onClick={() => setDateFinderOpen(true)}
        >
          <span className="font-medium inline-block">Open date finder</span>

          <Svg name="calendar" color="white" css="ml-1" />
        </div>
        <DateFinder
          value={dateFinderValue}
          open={dateFinderOpen}
          timelineData={timelineData}
          setOpen={setDateFinderOpen}
          onChange={(newVal) => {
            setCurrentValue(newVal);
          }}
        />
      </div>
    </FormField>
  );
}
