import React, { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import { useLazyQuery } from "@apollo/client";
import { FETCH_USER } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
export default function DatePicker({
  handleChange,
  date,
  error,
  placeholder = "Enter a date",
  minDate,
  maxDate = null,
}) {
  const user = useContext(AuthContext);
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
    <ReactDatePicker
      minDate={firstDate}
      maxDate={maxDate || new Date()}
      startDate={jsDate || new Date()}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      className={error && "border border-red rounded"}
      selected={jsDate}
      onChange={(newDate) => {
        if (newDate) {
          setJsDate(newDate);
          handleChange(newDate);
        }
      }}
    />
  );
}
