import React from "react";
import { NavLink } from "react-router-dom";
import Svg from "./svg";

import Menu from "./menu";

export default function Header({ minimal = false }) {
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex">
        <NavLink to="/" exact>
          <Svg name="logo" />
        </NavLink>
        {!minimal && (
          <nav className="ml-3">
            <NavLink
              className="nav-link"
              to="/"
              activeClassName="nav-link-active"
              exact
            >
              Timeline
            </NavLink>
            <NavLink
              className="nav-link"
              to="/publish"
              activeClassName="nav-link-active"
            >
              Publish
            </NavLink>
            <NavLink
              className="nav-link"
              to="/share"
              activeClassName="nav-link-active"
            >
              Share
            </NavLink>
          </nav>
        )}
      </div>
      <Menu />
    </header>
  );
}
