import React, { useState, useEffect, useContext } from "react";
import ReactDatePicker from "react-datepicker";
import { useQuery } from "@apollo/client";
import { FETCH_USER } from "~/lib/gql";
import { AuthContext } from "~/components/authWrap";
export default function DatePicker({
  handleChange,
  date,
  error,
  placeholder = "Enter a date",
}) {
  const user = useContext(AuthContext);
  const { data } = useQuery(FETCH_USER, { variables: { userId: user.id } });
  const [startDate, setStartDate] = useState(null);
  const [jsDate, setJsDate] = useState(null);

  useEffect(() => {
    if (data.stt_user_by_pk) {
      setStartDate(new Date(data.stt_user_by_pk.dob));
    }
  }, [data]);

  useEffect(() => {
    if (!jsDate) {
      setJsDate(date ? new Date(date) : null);
    }
  }, [date]);

  return (
    <ReactDatePicker
      startDate={jsDate || new Date()}
      minDate={startDate}
      dateFormat="dd/MM/yyyy"
      maxDate={new Date()}
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
