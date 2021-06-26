import React from "react";
import { useRouteMatch } from "react-router";
import { useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";
import Svg from "~/components/svg";
import Button from "~/components/button";

import MainMenu from "~/components/mainMenu";
import { FETCH_LOCAL_UI_STATE } from "~/lib/gql";
import { setUIStateVar } from "~/lib/apollo";

export default function Header({ minimal = false }) {
  const isTimeline = useRouteMatch("/");
  const { data } = useQuery(FETCH_LOCAL_UI_STATE);
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
      <div className="flex">
        {isTimeline && isTimeline.isExact && (
          <Button
            onClick={() =>
              setUIStateVar({ showPreview: !data.uiState.showPreview })
            }
          >
            {`${data.uiState.showPreview ? "Hide" : "Show"} Preview`}
          </Button>
        )}
        <MainMenu />
      </div>
    </header>
  );
}
