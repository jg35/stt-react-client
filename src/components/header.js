import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import Svg from "~/components/svg";
import Button from "~/components/button";
import MainMenu from "~/components/mainMenu";
import { UIContext } from "~/app";

export default function Header({ minimal = false }) {
  const { uiState, updateUiState } = useContext(UIContext);
  const isTimeline = useRouteMatch("/");
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex">
        <NavLink to="/">
          <Svg name="logo" />
        </NavLink>
        {!minimal && (
          <nav className="ml-3" id="nav-items">
            <NavLink
              className="nav-link"
              id="nav-item-timeline"
              to="/"
              activeClassName="nav-link-active"
              exact
            >
              Timeline
            </NavLink>
            <NavLink
              className="nav-link"
              to="/edit"
              activeClassName="nav-link-active"
            >
              Edit
            </NavLink>
            <NavLink
              className="nav-link"
              to="/publish"
              activeClassName="nav-link-active"
            >
              Publish
            </NavLink>
          </nav>
        )}
      </div>
      <div className="flex">
        {isTimeline && isTimeline.isExact && (
          <Button
            onClick={() => updateUiState({ showPreview: !uiState.showPreview })}
          >
            {`${uiState.showPreview ? "Hide" : "Show"} Preview`}
          </Button>
        )}
        <MainMenu />
      </div>
    </header>
  );
}
