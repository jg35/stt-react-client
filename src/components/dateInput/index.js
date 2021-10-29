import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_TIMELINE_VIEW } from "~/lib/gql";

import { Button } from "~/components/_styled";
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
  placeholder = "YYYY/MM/DD",
  minDate,
  maxDate = null,
  smartDate = null,
  setShowCaption,
  label = "Date",
  caption = null,
  insideModal = true,
  useDateFinder = true,
}) {
  const inputRef = useRef(null);
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
    if (!useDateFinder) {
      return "Years, months and days (e.g. 1953/10/04)";
    }
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
      return "Years, months and days (e.g. 1953/10/04)";
    }
  }

  function dateFinderInputValueChange() {
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
  }

  // Setting the date finder value from changes in the input
  useEffect(() => {
    if (useDateFinder) {
      dateFinderInputValueChange();
    } else {
      let dt;
      if (typeof inputValue === "string") {
        dt = DateTime.fromFormat(
          inputValue.trim().replaceAll("/", "-"),
          "yyyy-MM-dd"
        );
      }
      onChangeHandler(dt?.toISODate() || inputValue || "");
    }
  }, [inputValue, timelineData]);

  return (
    <FormField label={label} error={error} caption={getCaption()} css="w-full">
      <div
        className={`relative flex flex-wrap md:flex-nowrap w-full border rounded-b md:rounded-r md:rounded-l-none ${
          error ? "border-red" : "border-transparent"
        }`}
      >
        <div className="relative w-full flex">
          <input
            autoComplete="off"
            id="dateFinderInput"
            onChange={(e) => setInputValue(e.target.value)}
            className="input"
            value={inputValue}
            type="text"
            placeholder={placeholder}
          />
          {smartDate && smartDate.isSmartDate && (
            <span
              className={`absolute right-2 top-2.5 p-1 uppercase font-bold text-xs rounded cursor-help ${
                smartDate.exact
                  ? "border-green text-green"
                  : "border-lightBlack text-lightBlack"
              }`}
              title={
                smartDate.exact
                  ? "We set this date automatically because the question relates to a specific day in your life."
                  : "We've suggested this date from the time period you selected, question dates or your approximate age at the time."
              }
            >
              {smartDate.exact ? (
                <span className="flex block">
                  Auto&nbsp;
                  <Svg name="check" color="green" size="10" />
                </span>
              ) : (
                "Suggested"
              )}
            </span>
          )}
        </div>
        {useDateFinder && (
          <>
            <div ref={inputRef} className="w-full md:w-auto">
              <Button
                id="findDateBtn"
                variant="cta"
                size="compact"
                title="Find a date"
                css=" h-full w-full md:w-40 rounded-b rounded-t-none md:rounded-l-none md:rounded-r bg-offBlack"
                onClick={() => setDateFinderOpen(!dateFinderOpen)}
              >
                <span className="font-medium inline-block">Find a date</span>

                <Svg name="calendar" color="white" css="ml-1" />
              </Button>
            </div>
            <DateFinder
              smartDateDetailLevel={
                smartDate && smartDate.isSmartDate && smartDate.detailLevel
              }
              insideModal={insideModal}
              inputRef={inputRef}
              value={dateFinderValue}
              open={dateFinderOpen}
              timelineData={timelineData}
              setOpen={setDateFinderOpen}
              onChange={(newVal) => {
                onChangeHandler(newVal);
                setCurrentValue(newVal);
              }}
            />
          </>
        )}
      </div>
    </FormField>
  );
}
