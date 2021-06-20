import React from "react";

export default function Svg({ name, className = "" }) {
  switch (name) {
    case "menu":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
        </svg>
      );
    case "menu-open":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24"
          viewBox="0 0 24 24"
          width="24"
        >
          <path d="M0 0h24v24H0V0z" fill="none"></path>
          <path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z"></path>
        </svg>
      );
    case "logo":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <g
            fill="none"
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            strokeWidth="2"
          >
            <path
              data-name="Path 11"
              d="M25 14.143l-12.821 7.453-10.6-6.573A3.436 3.436 0 011 12.754c0-.554.162-.541.353-.692.574-.456 1.731.2 2.109.439.506.317 8.589 4.99 8.589 4.99L25 10.417"
            />
            <path
              data-name="Path 12"
              d="M23.651 11.154a3.8 3.8 0 00.422 3.364"
            />
            <path
              data-name="Path 13"
              d="M25 10.226l-12.821 7.452-10.6-6.573A3.435 3.435 0 011 8.838c0-.554.162-.541.353-.692.574-.456 1.731.2 2.109.439.506.315 8.589 4.989 8.589 4.989L25 6.499l-9.963-5.5L1.353 8.145"
            />
            <path
              data-name="Path 14"
              d="M23.651 7.236a3.8 3.8 0 00.422 3.364"
            />
          </g>
        </svg>
      );
    case "preview":
      return (
        <svg
          id="remove-red-eye-24px"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
        >
          <path id="Path_6" data-name="Path 6" d="M0,0H20V20H0Z" fill="none" />
          <path
            id="Path_7"
            data-name="Path 7"
            d="M10,4.5A9.716,9.716,0,0,0,1,10a9.716,9.716,0,0,0,9,5.5A9.716,9.716,0,0,0,19,10,9.716,9.716,0,0,0,10,4.5Zm0,9.167A3.9,3.9,0,0,1,5.909,10,3.9,3.9,0,0,1,10,6.333,3.9,3.9,0,0,1,14.091,10,3.9,3.9,0,0,1,10,13.667ZM10,7.8A2.335,2.335,0,0,0,7.545,10,2.335,2.335,0,0,0,10,12.2,2.335,2.335,0,0,0,12.455,10,2.335,2.335,0,0,0,10,7.8Z"
            fill="#030303"
          />
        </svg>
      );

    default:
      return null;
  }
}
