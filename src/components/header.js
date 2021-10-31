import React, { useContext } from "react";
import { useRouteMatch } from "react-router";
import { NavLink } from "react-router-dom";
import Svg from "~/components/svg";
import { Button, Grid } from "~/components/_styled";
import MainMenu from "~/components/mainMenu";
import { UIContext } from "~/app";
import { AuthContext } from "~/components/authWrap";
import NotificationMenu from "~/components/notifications/notificationMenu";
import { max } from "lodash-es";

export default function Header({
  minimal = false,
  scrollable = false,
  css,
  maxWidth,
}) {
  console.log("maxWidth", maxWidth);
  const { uiState, updateUiState } = useContext(UIContext);
  const {
    authState: { dbUser },
  } = useContext(AuthContext);
  const isTimeline = useRouteMatch("/");
  const isBilling = useRouteMatch("/settings");

  return (
    <div className={`w-full bg-white ${css}`}>
      <header className={`px-4 py-2 mx-auto`} style={{ maxWidth }}>
        <Grid autoRows="auto-rows-max" colSpan={[`col-span-6`]}>
          <div className="flex items-center h-full">
            <NavLink to="/">
              <Svg name="logo" color="black" />
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
                  css="w-auto bg-transparent border-transparent"
                  onClick={() =>
                    updateUiState({ showPreview: !uiState.showPreview })
                  }
                >
                  {`${uiState.showPreview ? "Hide" : "Show"} Preview`}
                </Button>
              </div>
            )}
            <div className="mr-2">
              <NotificationMenu notifications={dbUser?.notifications || []} />
            </div>

            <MainMenu />
          </div>
        </Grid>
      </header>
    </div>
  );
}
