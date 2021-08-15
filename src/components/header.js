import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import Svg from "~/components/svg";
import { Button, Grid } from "~/components/_styled";
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
    <header className="py-4 px-2">
      <Grid
        autoRows="auto-rows-min"
        colSpan={[
          "col-span-6 md:col-span-4 md:order-1",
          "col-span-6 md:col-span-4 md:order-3",
          "col-span-12 md:col-span-4 md:order-2",
        ]}
      >
        <div className="flex items-center h-full">
          <NavLink to="/">
            <Svg name="logo" />
          </NavLink>
          {!minimal && dbUser && (
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
                to={`/publish${dbUser.versions.length === 1 ? "/new" : ""}`}
                activeClassName="nav-link-active"
              >
                Publish
              </NavLink>
            </nav>
          )}
        </div>
        <div className="flex justify-end items-center h-full">
          {isTimeline && isTimeline.isExact && (
            <div id="show-preview-btn" className="mr-2 hidden lg:block">
              <Button
                size="compact"
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
        {!uiState.hideTrialStatus ? (
          <div className="flex justify-center items-center h-full">
            {dbUser && (
              <TrialStatus
                stripeCustomerId={dbUser.stripeCustomerId}
                expiry={dbUser.trialExpiresDate}
                status={dbUser.subscriptionStatus}
              />
            )}
          </div>
        ) : null}
      </Grid>
    </header>
  );
}
