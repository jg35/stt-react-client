import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import Button from "./button";
import Svg from "./svg";
import Auth from "./auth";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    <Auth />,
    <Button
      onClick={() => setOpen(!open)}
      minimal
      css="fill p-2 flex justify-end items-center"
    >
      <Svg name="preview" /> Preview
    </Button>,
    <NavLink className="fill text-right p-2" to="settings">
      Settings
    </NavLink>,
  ];
  return (
    <div className="relative">
      <Button onClick={() => setOpen(!open)} minimal>
        <Svg name="menu" />
      </Button>
      {open && (
        <div className="animate-fade-in absolute right-0 flex flex-col items-end bg-white rounded-md shadow-lg z-10">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="hover:bg-lightestGray text-right cursor-pointer h-10 flex justify-right items-center w-40"
              onClick={() => setOpen(false)}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
