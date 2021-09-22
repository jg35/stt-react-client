import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import Svg from "~/components/svg";
import { Button, Grid } from "~/components/_styled";
import MainMenu from "~/components/mainMenu";
import TrialStatus from "~/components/trialStatus";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";

export default function Header({ minimal = false, scrollable = false }) {
  const { uiState, updateUiState } = useContext(UIContext);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  const isTimeline = useRouteMatch("/");
  const isBilling = useRouteMatch("/settings");
  const showTrialStatusMessage =
    !uiState.hideTrialStatus &&
    !isBilling &&
    dbUser &&
    dbUser.subscriptionStatus === "IN_TRIAL";

  return (
    <header
      className={`px-4 py-2 ${scrollable && "shadow z-40 lg:shadow-none"}`}
    >
      <Grid
        autoRows="auto-rows-max"
        colSpan={[
          `col-span-6 ${showTrialStatusMessage && "md:col-span-4"}`,
          `col-span-6 ${showTrialStatusMessage && "md:col-span-4 md:order-3"}`,
        ].concat(
          showTrialStatusMessage ? "col-span-12 md:col-span-4 md:order-2" : []
        )}
      >
        <div className="flex items-center h-full">
          <NavLink to="/">
            <Svg name="logo" color="text-black" />
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
                id="nav-item-edit"
                to="/edit"
                activeClassName="nav-link-active"
              >
                Edit
              </NavLink>
              <NavLink
                className="nav-link"
                id="nav-item-publish"
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
                css="w-auto"
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
        {showTrialStatusMessage && (
          <div>
            <TrialStatus
              stripeCustomerId={dbUser.stripeCustomerId}
              expiry={dbUser.trialExpiresDate}
              status={dbUser.subscriptionStatus}
            />
          </div>
        )}
      </Grid>
    </header>
  );
}
