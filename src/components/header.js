import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import Svg from "~/components/svg";
import Button from "~/components/button";
import MainMenu from "~/components/mainMenu";
import TrialStatus from "~/components/trialStatus";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";

export default function Header({ minimal = false }) {
  const { uiState, updateUiState } = useContext(UIContext);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  const isTimeline = useRouteMatch("/");
  return (
    <header className="flex justify-between items-center py-4">
      <div className="flex">
        <NavLink to="/">
          <Svg name="logo" />
        </NavLink>
        {!minimal && (
          <nav className="ml-3 flex" id="nav-items">
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
      <div>
        {dbUser && (
          <TrialStatus
            stripeCustomerId={dbUser.stripeCustomerId}
            expiry={dbUser.trialExpiresDate}
            status={dbUser.subscriptionStatus}
          />
        )}
      </div>
      <div className="flex">
        {isTimeline && isTimeline.isExact && (
          <div id="show-preview-btn">
            <Button
              onClick={() =>
                updateUiState({ showPreview: !uiState.showPreview })
              }
            >
              {`${uiState.showPreview ? "Hide" : "Show"} Preview`}
            </Button>
          </div>
        )}
        <MainMenu />
      </div>
    </header>
  );
}
