import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import DatePicker from "react-datepicker";
import { FETCH_LOCAL_AUTH_STATE } from "~/lib/gql";
import Uppy from "../uppy";
import { getImgIxSrc } from "~/lib/util";
import Button from "../button";

export default function PhotoForm({ item, setItem }) {
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);
  const [jsDate, setJsDate] = useState(null);
  const [replaceUrl, setReplaceUrl] = useState("");

  useEffect(() => {
    setJsDate(item.date ? new Date(item.date) : null);
  }, [item]);

  return (
    <div>
      <h1 className="modal-title">{item.id ? "Update" : "Add"} photo</h1>
      {item.mediaUrl ? (
        <img
          src={`${getImgIxSrc(item.mediaUrl)}?height=250`}
          className="h-auto"
          alt={item.mediaCaption}
          title={item.mediaCaption}
        />
      ) : (
        <Uppy
          userId={data.authState.userDetails.id}
          item={item}
          setItem={setItem}
        />
      )}
      {item.id && (
        <div className="my-2">
          <Button
            onClick={() => {
              if (replaceUrl) {
                setItem({ ...item, mediaUrl: replaceUrl });
                setReplaceUrl(null);
              } else {
                setReplaceUrl(item.mediaUrl);
                setItem({ ...item, mediaUrl: null });
              }
            }}
          >
            {replaceUrl ? "Back" : "Replace image"}
          </Button>
        </div>
      )}

      {(item.mediaUrl || item.id) && (
        <>
          <div className="form-control mt-4">
            <label>Caption</label>
            <input
              className="input"
              value={item.mediaCaption}
              onChange={(e) =>
                setItem({ ...item, mediaCaption: e.target.value })
              }
            />
          </div>
          <div className="form-control mt-4">
            <label>Date</label>
            <DatePicker
              selected={jsDate}
              onChange={(newDate) => {
                setJsDate(newDate);
                setItem({
                  ...item,
                  date: newDate.toISOString().replace(/T.*/, ""),
                  dateType: "MANUAL",
                });
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
