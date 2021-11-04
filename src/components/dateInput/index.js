import { useState, useEffect, useRef } from "react";
import { DateTime } from "luxon";
import { useCustomQuery } from "~/hooks/useCustomApollo";
import { FETCH_TIMELINE_VIEW } from "~/lib/gql";

import { Button, FormCaption, FormLabel } from "~/components/_styled";
import Svg from "~/components/svg";
import FormField from "~/components/formField";
import DateFinder from "~/components/dateInput/dateFinder";
import {
  getDateFinderFormat,
  getInputFormat,
} from "~/components/dateInput/lib";
import { getDatePickerAgeCaption } from "~/lib/util";

function DatePart({
  val,
  setVal,
  label,
  maxLength,
  placeholder,
  inputCss = "pl-12 md:pl-14",
  isLast = false,
}) {
  const [localVal, setLocalVal] = useState(val);

  useEffect(() => {
    setLocalVal(val);
  }, [val]);
  const inputRef = useRef(null);
  return (
    <div
      className={`flex-1 md:flex-none md:w-32 relative mb-2 md:mb-0 ${
        isLast ? "md:mr-2" : "mr-2"
      }`}
    >
      <span
        className={`absolute h-full flex items-center text-lg pl-2 md:pl-4`}
        onClick={() => inputRef && inputRef.current && inputRef.current.focus()}
      >
        {label}:
      </span>
      <input
        ref={inputRef}
        autoComplete="off"
        id="dateFinderInput"
        onChange={(e) => setLocalVal(e.target.value)}
        onBlur={() => setVal(localVal)}
        className={`input h-12 rounded w-full bg-lightestGray focus:bg-lightGray border-0 ${inputCss}`}
        value={localVal}
        type="text"
        maxLength={maxLength}
        placeholder={placeholder}
      />
    </div>
  );
}

export default function DateInput({
  handleChange,
  date,
  error: formikError,
  placeholder = "YYYY/MM/DD",
  minDate,
  maxDate = null,
  smartDate = null,
  label = "Enter a date",
  caption = null,
  insideModal = true,
}) {
  const inputRef = useRef(null);
  const [dateFinderValues, setDateFinderValues] = useState({
    year: "",
    month: "",
    day: "",
  });
  const [localError, setLocalError] = useState("");
  const [init, setInit] = useState(false);
  const [yearValue, setYearValue] = useState("");
  const [monthValue, setMonthValue] = useState("");
  const [dayValue, setDayValue] = useState("");
  const [dateFinderOpen, setDateFinderOpen] = useState(false);
  const { data: timelineData } = useCustomQuery(FETCH_TIMELINE_VIEW, {
    userId: true,
  });

  // Initialise date from outside
  useEffect(() => {
    if (!init && date) {
      const dt = DateTime.fromISO(date);
      if (dt.isValid) {
        setYearValue(dt.toFormat("yyyy"));
        setMonthValue(dt.toFormat("M"));
        setDayValue(dt.toFormat("d"));
        setDateFinderValues({
          year: dt.toFormat("yyyy"),
          month: dt.toFormat("MM"),
          day: dt.toFormat("dd"),
        });
      }
      setInit(true);
    } else if (!date && !init) {
      setInit(true);
    }
  }, [date]);

  useEffect(() => {
    if (init) {
      let format =
        (yearValue ? "yyyy" : "") +
        (!!monthValue ? "-M" : "") +
        (!!dayValue ? "-d" : "");
      let value =
        (yearValue ? yearValue : "") +
        (monthValue ? `-${monthValue}` : "") +
        (dayValue ? `-${dayValue}` : "");
      if (!yearValue && (monthValue || dayValue)) {
        setLocalError("Year is required");
        return;
      }
      if (!value.length) {
        setLocalError("Date is required");
        return;
      }
      const dt = DateTime.fromFormat(value, format);

      // Default to invalid
      const invalidValue = {
        year: null,
        month: null,
        day: null,
      };
      let dfValues;
      if (dt.isValid) {
        const dobDb = DateTime.fromISO(timelineData.stt_user_by_pk.dob);
        const dayDobOffset = dt.diff(dobDb, ["days"]).toObject().days >= 0;
        const dayNowOffset = Math.floor(
          DateTime.utc().diff(dt, ["days"]).toObject().days >= 0
        );
        // Valid
        if (dayDobOffset && dayNowOffset) {
          dfValues = {
            year: dt.isValid && dt.toFormat("yyyy"),
            month: dt.isValid && !!monthValue ? dt.toFormat("MM") : null,
            day:
              dt.isValid && !!monthValue && !!dayValue
                ? dt.toFormat("dd")
                : null,
          };
          setLocalError("");
        } else {
          if (!dayDobOffset) {
            setLocalError(`Date cannot be before date of birth`);
          } else {
            setLocalError("Date cannot be in the future");
          }
          // Now invalid
          dfValues = invalidValue;
        }
      } else {
        setLocalError("Date is invalid");
        // TODO - if years valid, set that, if years & months valid alone, set that
        dfValues = invalidValue;
      }

      setDateFinderValues(dfValues);
      // Always call onChange to validate outside of Date finder
      onChangeHandler(dt.isValid ? dt.toISODate() : "");
    }
  }, [yearValue, monthValue, dayValue]);

  function onChangeHandler(newVal) {
    if (newVal !== date) {
      handleChange(newVal);
    }
  }

  function getCaption() {
    if (caption) {
      return caption;
    } else if (date) {
      let format =
        (yearValue ? "yyyy" : "") +
        (!!monthValue ? "-M" : "") +
        (!!dayValue ? "-d" : "");
      let value =
        (yearValue ? yearValue : "") +
        (monthValue ? `-${monthValue}` : "") +
        (dayValue ? `-${dayValue}` : "");
      const date = DateTime.fromFormat(value, format).toISODate();
      return (
        <span>
          {getDatePickerAgeCaption(date, timelineData.stt_user_by_pk.dob)}
        </span>
      );
    } else {
      return "Enter a rough date or use the date finder";
    }
  }

  // function dateFinderInputValueChange() {
  //   if (timelineData) {
  //     if (inputValue === null) {
  //       return;
  //     }

  //     const inputFormat = getInputFormat(inputValue);
  //     const inputDt = DateTime.fromFormat(
  //       inputValue.slice(0, inputFormat.length),
  //       inputFormat
  //     );
  //     if (!inputValue.length < 4) {
  //       setDateFinderValue("");
  //     }
  //     if (!inputDt.isValid) {
  //       onChangeHandler(inputValue);
  //     } else {
  //       // All good in DA HOOD
  //       onChangeHandler(inputDt.toISODate());
  //       const dobDb = DateTime.fromISO(timelineData.stt_user_by_pk.dob);
  //       const dayDobOffset = inputDt.diff(dobDb, ["days"]).toObject().days;
  //       const dayNowOffset = Math.floor(
  //         DateTime.utc().diff(inputDt, ["days"]).toObject().days
  //       );
  //       if (dayNowOffset >= 0 && dayNowOffset >= 0 && inputValue.length >= 4) {
  //         // Get nearest valid format to pass to dateFinder
  //         const dfFormat = getDateFinderFormat(inputValue);
  //         // Find the nearest valid value
  //         const dfDt = DateTime.fromFormat(
  //           inputValue.slice(0, dfFormat.length),
  //           dfFormat
  //         );
  //         if (dfDt.isValid) {
  //           if (dayDobOffset >= 0 && dayNowOffset >= 0) {
  //             const isoValueF = dfDt.toFormat(dfFormat.replaceAll("/", "-"));
  //             if (isoValueF !== dateFinderValue) {
  //               setDateFinderValue(isoValueF);
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  return (
    <div className="relative flex flex-col max-w-xl">
      <div className="flex justify-between items-center">
        <FormLabel css="mb-1">{label}</FormLabel>
        {smartDate && smartDate.isSmartDate && (
          <span
            className={`mb-1 uppercase font-bold text-xs cursor-help ${
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

      <div>
        <div className="flex rounded p-2 bg-white flex-wrap md:flex-nowrap shadow mb-2">
          <DatePart
            key="1"
            label="Year"
            val={yearValue}
            setVal={setYearValue}
            maxLength="4"
            placeholder={dateFinderValues.year || "2000"}
          />
          <DatePart
            key="2"
            label="Month"
            val={monthValue}
            setVal={setMonthValue}
            maxLength="2"
            placeholder={date.slice(5, 7).replace(/^0/, "") || "1"}
            inputCss="pl-16 md:pl-20"
          />
          <DatePart
            key="3"
            label="Day"
            val={dayValue}
            setVal={setDayValue}
            maxLength="2"
            placeholder={date.slice(8, 10).replace(/^0/, "") || "1"}
            isLast
          />
          {init && (
            <>
              <div ref={inputRef} className="w-full">
                <Button
                  id="findDateBtn"
                  variant="cta"
                  // size="compact"
                  title="Find a date"
                  css="border-offBlack h-12 rounded bg-offBlack"
                  onClick={() => setDateFinderOpen(!dateFinderOpen)}
                >
                  <span className="inline-block font-normal">Find date</span>
                </Button>
              </div>
              <DateFinder
                smartDateDetailLevel={
                  smartDate && smartDate.isSmartDate && smartDate.detailLevel
                }
                insideModal={insideModal}
                inputRef={inputRef}
                value={{
                  month: dateFinderValues.month,
                  day: dateFinderValues.day,
                  year: dateFinderValues.year,
                }}
                open={dateFinderOpen}
                timelineData={timelineData}
                setOpen={setDateFinderOpen}
                onChange={({ year, month, day }) => {
                  setYearValue(year);
                  setMonthValue(month);
                  setDayValue(day);
                }}
              />
            </>
          )}
        </div>

        <FormCaption variant={formikError || localError ? "error" : "info"}>
          {formikError || localError || getCaption()}
        </FormCaption>
      </div>
    </div>
  );
}
