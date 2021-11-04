import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import FormField from "~/components/formField";

function fromISO(date) {
  return DateTime.fromISO(date).toFormat("dd/MM/yyyy");
}

function toISO(date) {
  return DateTime.fromFormat(date, "dd/MM/yyyy").toISODate();
}

export default function SimpleDateInput({ date, label, error, handleChange }) {
  const [isoValue, setIsoValue] = useState(date);
  const [inputValue, setInputValue] = useState(fromISO(date));
  // Initialise date from outside
  useEffect(() => {
    if (!isoValue && date) {
      setIsoValue(date);
      setInputValue(fromISO(date));
    }
  }, [date]);

  useEffect(() => {
    const isoVal = toISO(inputValue);
    handleChange(isoVal);
    setIsoValue(isoVal);
  }, [inputValue]);

  return (
    <FormField
      label={label}
      error={error}
      caption="e.g. 04/10/1953"
      css="w-full"
    >
      <div
        className={`relative flex flex-wrap md:flex-nowrap w-full border rounded-none ${
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
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>
    </FormField>
  );
}
