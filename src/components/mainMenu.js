import React from "react";
import { NavLink } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { FETCH_LOCAL_AUTH_STATE } from "~/lib/gql";
import { signOut } from "~/lib/auth";

import Svg from "~/components/svg";
import Menu from "~/components/menu";

export default function MainMenu() {
  const { data } = useQuery(FETCH_LOCAL_AUTH_STATE);
  const currentUser = data.authState.userDetails;

  return (
    <Menu
      toggle={<Svg name="menu" />}
      items={[
        {
          component: (
            <NavLink className="fill text-right" to="account">
              <div className="flex items-center justify-end p-2">
                <div className="mr-2">
                  <span className="block">{currentUser.displayName}</span>
                  <span className="text-gray">{currentUser.email}</span>
                </div>
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName}
                  className="w-10 h-10 rounded"
                />
              </div>
            </NavLink>
          ),
        },
        {
          component: (
            <NavLink
              className="fill text-right flex items-center justify-end p-2"
              to="settings"
            >
              Settings <Svg name="settings" css="ml-2" />
            </NavLink>
          ),
        },
        {
          component: (
            <button className="fill text-right p-2" onClick={() => signOut()}>
              Log out
            </button>
          ),
        },
      ]}
    />
  );
}
