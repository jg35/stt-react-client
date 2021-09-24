import React, { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import { useLazyQuery } from "@apollo/client";
import { FETCH_USER } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
import SmartDate from "~/components/smartDate";

export default function DatePicker({
  handleChange,
  date,
  error,
  placeholder = "Enter a date",
  minDate,
  maxDate = null,
  popperPlacement = "bottom-start",
  smartDate = null,
}) {
  const {
    authState: { user },
  } = useContext(AuthContext);
  const [getUser, { data }] = useLazyQuery(FETCH_USER, {
    variables: { userId: user.id },
  });
  const [firstDate, setFirstDate] = useState(minDate);
  const [jsDate, setJsDate] = useState(null);

  useEffect(() => {
    if (!firstDate) {
      getUser();
    }
  }, []);

  useEffect(() => {
    if (data && data.stt_user_by_pk) {
      setFirstDate(new Date(data.stt_user_by_pk.dob));
    }
  }, [data]);

  useEffect(() => {
    if (!jsDate) {
      setJsDate(date ? new Date(date) : null);
    }
  }, [date]);

  return (
    <div className="relative overflow-visible">
      <ReactDatePicker
        id="form-datepicker"
        minDate={firstDate}
        maxDate={maxDate || new Date()}
        startDate={jsDate || new Date()}
        dateFormat="dd/MM/yyyy"
        placeholderText={placeholder}
        popperPlacement={popperPlacement}
        className={`flex-1 ${error && "border border-red rounded z-50"}`}
        selected={jsDate}
        onChange={(newDate) => {
          if (newDate) {
            setJsDate(newDate);
            handleChange(newDate);
          }
        }}
      />
      {smartDate && smartDate.isSmartDate && (
        <div className="absolute right-4 z-50 top-2">
          <SmartDate reason={smartDate.smartDateReason} />
        </div>
      )}
    </div>
  );
}
