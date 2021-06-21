import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "../lib/gql";
import { signOut } from "../lib/auth";

import Svg from "./svg";
import Menu from "./menu";

export default function MainMenu() {
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);
  const currentUser = data.authState.userDetails;

  return (
    <Menu
      toggle={<Svg name="menu" />}
      sections={[
        [
          <NavLink className="fill text-right" to="account">
            <div className="flex items-center justify-end">
              <div className="mr-2">
                <span className="block">{currentUser.displayName}</span>
                <span className="text-gray">{currentUser.email}</span>
              </div>
              <img src={currentUser.photoURL} className="w-10 h-10 rounded" />
            </div>
          </NavLink>,
        ],
        [
          <NavLink
            className="fill text-right flex items-center justify-end"
            to="settings"
          >
            Settings <Svg name="settings" css="ml-2" />
          </NavLink>,
          ,
        ],
        [
          <button className="fill text-right" onClick={() => signOut()}>
            Log out
          </button>,
        ],
      ]}
    />
  );
}
