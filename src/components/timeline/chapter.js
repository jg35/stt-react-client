import React from "react";

export default function ChapterMarker({ title }) {
  return (
    <div className="flex flex-col justify-center items-center font-medium px-4 text-lg min-h-full">
      <svg
        id="bookmark-24px"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          id="Path_40"
          data-name="Path 40"
          d="M0-.138H24v24H0Z"
          transform="translate(0 0.138)"
          fill="none"
        />
        <path
          id="Path_41"
          data-name="Path 41"
          d="M17,2.862H7a2.006,2.006,0,0,0-2,2v16l7-3,7,3v-16A2.006,2.006,0,0,0,17,2.862Z"
          transform="translate(0 0.138)"
        />
      </svg>

      {title}
    </div>
  );
}
